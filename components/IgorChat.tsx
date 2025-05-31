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
  // Estado para el texto del input y los mensajes en pantalla
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isWaiting, setIsWaiting] = useState(false);

  // Referencia para hacer scroll automático al final del chat
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // UUID del usuario autenticado en Supabase
  const [uuid, setUuid] = useState<string | null>(null);

  // sessionId se inicializa vacío y se setea solo en el cliente (useEffect)
  const [sessionId, setSessionId] = useState<string>('');

  // 1) En el primer render en el cliente, leemos o creamos sessionId en localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const existing = localStorage.getItem('igor_session');
    if (existing) {
      setSessionId(existing);
    } else {
      const newId = crypto.randomUUID();
      localStorage.setItem('igor_session', newId);
      setSessionId(newId);
    }
  }, []);

  // 2) Obtener el UUID de Supabase Auth
  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user?.id) {
        setUuid(session.user.id);
      } else {
        console.warn('No hay sesión activa en Supabase Auth.');
      }
    };
    fetchSession();
  }, []);

  // 3) Cuando ya tengamos uuid y sessionId, inicializamos la sesión en Supabase
  useEffect(() => {
    if (!uuid || !sessionId) return;

    const initSession = async () => {
      // 3.1) Upsert en chat_sessions para crear o actualizar la sesión
      await supabase.from('chat_sessions').upsert({
        session_id: sessionId,
        user_id: uuid,
        updated_at: new Date().toISOString(),
      });

      // 3.2) Cargar mensajes previos de chat_messages
      const { data: prevMessages, error } = await supabase
        .from('chat_messages')
        .select('role, content')
        .eq('session_id', sessionId)
        .order('inserted_at', { ascending: true });

      if (error) {
        console.error('Error al cargar mensajes previos:', error);
        return;
      }
      if (prevMessages) {
        setMessages(prevMessages as Message[]);
      }
    };

    initSession();
  }, [uuid, sessionId]);

  // Función para enviar un nuevo mensaje
  const handleSend = async () => {
    if (!input.trim() || !uuid || !sessionId) return;

    const userMsg: Message = { role: 'user', content: input };
    // 1) Mostrar de inmediato en la UI (optimistic UI)
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsWaiting(true);

    // 2) Insertar el mensaje del usuario en Supabase
    await supabase.from('chat_messages').insert({
      session_id: sessionId,
      user_id: uuid,
      role: 'user',
      content: userMsg.content,
    });

    try {
      // 3) Llamar al webhook de n8n y obtener la respuesta del bot
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
        // 4) Mostrar respuesta del bot en la UI
        setMessages((prev) => [...prev, botMsg]);

        // 5) Insertar respuesta del bot en Supabase
        await supabase.from('chat_messages').insert({
          session_id: sessionId,
          user_id: uuid,
          role: 'assistant',
          content: botMsg.content,
        });
      }
    } catch (error) {
      console.error('Error al enviar mensaje a n8n:', error);
      const errMsg: Message = {
        role: 'assistant',
        content: 'Error al contactar con Igor.',
      };
      setMessages((prev) => [...prev, errMsg]);
      // También gravamos el error como mensaje del bot en Supabase
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

  // Permite reiniciar el chat, generar un nuevo sessionId y limpiar mensajes
  useImperativeHandle(ref, () => ({
    resetChat() {
      setMessages([]);
      setInput('');
      setIsWaiting(false);

      // Borrar sessionId anterior y crear uno nuevo
      if (typeof window !== 'undefined') {
        const newId = crypto.randomUUID();
        localStorage.setItem('igor_session', newId);
        setSessionId(newId);
      }
    },
  }));

  // Hacer scroll automático al final cada vez que cambie `messages`
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Enviar con Enter (si no está esperando)
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
            disabled={isWaiting || !uuid || !sessionId}
          />
          <button
            className={styles.iconButton}
            onClick={handleSend}
            disabled={isWaiting || !uuid || !sessionId}
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
