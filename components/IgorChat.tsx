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
  const [sessionId, setSessionId] = useState<string>(() => crypto.randomUUID()); // ← usa crypto.randomUUID()

  // Cargo el UUID de Supabase
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.id) setUuid(session.user.id);
      else console.warn('No hay sesión activa.');
    });
  }, []);

  const handleSend = async () => {
    if (!input.trim() || !uuid) return;

    const newMessages: Message[] = [
      ...messages,
      { role: 'user', content: input },
    ];
    setMessages(newMessages);
    setInput('');
    setIsWaiting(true);

    try {
      const res = await fetch(
        'https://manuachinelli.app.n8n.cloud/webhook/d6a72405-e6de-4e91-80da-9219b57633dd',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: input,
            userId: uuid,
            sessionId, // ← envío de sessionId generado nativamente
          }),
        }
      );

      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.reply },
        ]);
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
      setSessionId(crypto.randomUUID()); // ← genero un nuevo sessionId al resetear
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
