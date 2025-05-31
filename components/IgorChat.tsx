'use client';

import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import styles from './IgorChat.module.css';
import { Mic, SendHorizonal } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface IgorChatHandle {
  resetChat: () => void;
}

const IgorChat = forwardRef<IgorChatHandle>((_, ref) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isWaiting, setIsWaiting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [uuid, setUuid] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>(() => {
    const existing = localStorage.getItem('igor_session');
    if (existing) return existing;
    const newId = crypto.randomUUID();
    localStorage.setItem('igor_session', newId);
    return newId;
  });

  // Cargar UUID de Supabase y luego inicializar sesión + mensajes
  useEffect(() => {
    async function initSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        console.warn('No hay sesión activa.');
        return;
      }
      const userId = session.user.id;
      setUuid(userId);

      // 1) Upsert en chat_sessions
      await supabase
        .from('chat_sessions')
        .upsert({
          session_id: sessionId,
          user_id: userId,
          updated_at: new Date().toISOString(),
        });

      // 2) Seleccionar mensajes previos
      const { data: prevMessages, error } = await supabase
        .from('chat_messages')
        .select('role, content')
        .eq('session_id', sessionId)
        .order('inserted_at', { ascending: true });

      if (error) {
        console.error('Error al cargar mensajes:', error);
        return;
      }
      if (prevMessages) {
        setMessages(prevMessages as Message[]);
      }
    }

    initSession();
  }, [sessionId]);

  const handleSend = async () => {
    if (!input.trim() || !uuid) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsWaiting(true);

    // 1) Insertar mensaje de usuario en Supabase
    await supabase.from('chat_messages').insert({
      session_id: sessionId,
      user_id: uuid,
      role: 'user',
      content: userMsg.content,
    });

    try {
      const res = await fetch(
        'https://manuachinelli.app.n8n.cloud/webhook/d6a72405-e6de-4e91-80da-9219b57633dd',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userMsg.content,
            userId: uuid,
            sessionId,
          }),
        }
      );

      const data = await res.json();
      if (data.reply) {
        const botMsg: Message = { role: 'assistant', content: data.reply };
        setMessages((prev) => [...prev, botMsg]);

        // 2) Insertar respuesta del bot en Supabase
        await supabase.from('chat_messages').insert({
          session_id: sessionId,
          user_id: uuid,
          role: 'assistant',
          content: botMsg.content,
        });
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      const errMsg: Message = {
        role: 'assistant',
        content: 'Error al contactar con Igor.',
      };
      setMessages((prev) => [...prev, errMsg]);
      await supabase.from('chat_messages').insert({
        session_id: sessionId,
        user_id: uuid,
        role: 'assistant',
        content: errMsg.content,
      });
    } finally {
      setIsWaiting(false);
    }
  };

  useImperativeHandle(ref, () => ({
    resetChat() {
      setMessages([]);
      setInput('');
      setIsWaiting(false);
      const newId = crypto.randomUUID();
      localStorage.setItem('igor_session', newId);
      setSessionId(newId);
    },
  }));

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isWaiting) handleSend();
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messagesContainer}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`${styles.messageBubble} ${
              msg.role === 'user' ? styles.userBubble : styles.assistantBubble
            }`}
          >
            {msg.content}
          </div>
        ))}
        {isWaiting && (
          <div className={styles.waiting}>Igor está escribiendo...</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputSection}>
        <div className={styles.inputBox}>
          <input
            className={styles.input}
            type="text"
            placeholder="Escribí tu mensaje..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isWaiting || !uuid}
          />
          <button
            className={styles.iconButton}
            onClick={handleSend}
            disabled={isWaiting || !uuid}
          >
            <SendHorizonal size={18} />
          </button>
          <button className={`${styles.iconButton} ${styles.disabled}`}>
            <Mic size={18} />
          </button>
        </div>
        <div className={styles.status}>Estás hablando con Igor v1.0.0</div>
      </div>
    </div>
  );
});

export default IgorChat;
