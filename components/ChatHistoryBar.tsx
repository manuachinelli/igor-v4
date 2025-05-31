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

interface IgorChatProps {
  sessionId: string;
}

const IgorChat = forwardRef<IgorChatHandle, IgorChatProps>(({ sessionId }, ref) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isWaiting, setIsWaiting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [uuid, setUuid] = useState<string | null>(null);

  // Cargo el UUID de Supabase
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user.id) setUuid(session.user.id);
      else console.warn('No hay sesión activa.');
    });
  }, []);

  // Cada vez que cambie sessionId, cargo el historial
  useEffect(() => {
    if (!uuid || !sessionId) return;
    const fetchHistory = async () => {
      const { data } = await supabase
        .from('chat_messages')
        .select('role, content')
        .eq('session_id', sessionId)
        .order('inserted_at', { ascending: true });

      if (data) {
        const hist = (data as { role: string; content: string }[]).map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }));
        setMessages(hist);
      }
    };
    fetchHistory();
  }, [sessionId, uuid]);

  const handleSend = async () => {
    if (!input.trim() || !uuid) return;

    const newMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setIsWaiting(true);

    try {
      // Guardar mensaje de usuario en Supabase
      await supabase.from('chat_messages').insert({
        user_id: uuid,
        session_id: sessionId,
        role: 'user',
        content: newMessage.content,
      });

      const res = await fetch(
        'https://manuachinelli.app.n8n.cloud/webhook/d6a72405-e6de-4e91-80da-9219b57633dd',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: input,
            userId: uuid,
            sessionId,
          }),
        }
      );

      const data = await res.json();
      if (data.reply) {
        const replyMessage: Message = { role: 'assistant', content: data.reply };
        setMessages((prev) => [...prev, replyMessage]);

        // Guardar respuesta en Supabase
        await supabase.from('chat_messages').insert({
          user_id: uuid,
          session_id: sessionId,
          role: 'assistant',
          content: replyMessage.content,
        });
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Error al contactar con Igor.' },
      ]);
    } finally {
      setIsWaiting(false);
    }
  };

  useImperativeHandle(ref, () => ({
    resetChat() {
      setMessages([]);
      setInput('');
      setIsWaiting(false);
      // Generar nuevo sessionId y guardar en localStorage
      const newSessionId = crypto.randomUUID();
      localStorage.setItem('igor_session', newSessionId);
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
        {isWaiting && <div className={styles.waiting}>Igor está escribiendo...</div>}
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
