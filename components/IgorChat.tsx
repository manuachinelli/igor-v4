'use client';

import {
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';
import styles from './IgorChat.module.css';
import { Mic, SendHorizonal } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface IgorChatProps {
  sessionId: string;
}

export interface IgorChatHandle {
  resetChat: () => void;
}

const suggestions = [
  'Quiero que les escribas a todos mis clientes que no me compran hace más de 6 meses y agendes reunión.',
  'Quiero que respondas todos los correos que recibo con comprobantes y luego me envíes a mí un resumen diario.',
  'Quiero que todos los PDFs que recibo por correo se carguen en un Excel.',
];

const IgorChat = forwardRef<IgorChatHandle, IgorChatProps>(
  ({ sessionId }, ref) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isWaiting, setIsWaiting] = useState(false);
    const [uuid, setUuid] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user.id) setUuid(session.user.id);
        else console.warn('No hay sesión activa.');
      });
    }, []);

    useEffect(() => {
      if (!uuid || !sessionId) return;
      const loadMessages = async () => {
        const { data } = await supabase
          .from('chat_messages')
          .select('role, content')
          .eq('user_id', uuid)
          .eq('session_id', sessionId)
          .order('inserted_at', { ascending: true });
        if (data) setMessages(data as Message[]);
      };
      loadMessages();
    }, [uuid, sessionId]);

    const handleSend = async () => {
      if (!input.trim() || !uuid) return;

      const newMessage: Message = { role: 'user', content: input };
      setMessages((prev) => [...prev, newMessage]);

      const texto = input;
      setInput('');
      setIsWaiting(true);

      try {
        await supabase.from('chat_messages').insert({
          user_id: uuid,
          session_id: sessionId,
          role: 'user',
          content: texto,
        });

        const res = await fetch(
          'https://manuachinelli.app.n8n.cloud/webhook/d6a72405-e6de-4e91-80da-9219b57633dd',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: texto, userId: uuid, sessionId }),
          }
        );

        const data = await res.json();
        if (data.reply) {
          const replyMessage: Message = {
            role: 'assistant',
            content: data.reply,
          };
          setMessages((prev) => [...prev, replyMessage]);

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
          <div className={styles.welcomeContainer}>
            <div className={styles.welcomeContent}>
              <img
  src="/my-igor.png"
  alt="Logo IGOR"
  className={`${styles.miniLogo} ${
    messages.length > 0 ? styles.logoFaded : ''
  }`}
/>
              {messages.length === 0 && (
                <>
                  <div className={styles.welcomeText}>
                    <p>
                      Igors puede ayudarte a automatizar todos tus tareas operativas que te impiden enfocarte en lo que te da valor.
                    </p>
                    <p>
                      También te ayudará con las métricas y todo lo que necesites saber de tu trabajo, decisiones y acciones.
                    </p>
                    <p>¿Cómo? Simplemente escribile y te guiará.</p>
                  </div>

                  {input.trim() === '' && (
                    <div className={styles.suggestionsWrapper}>
                      <div className={styles.suggestionsRow}>
                        <div
                          className={styles.suggestion}
                          onClick={() => setInput(suggestions[0])}
                        >
                          {suggestions[0]}
                        </div>
                        <div
                          className={styles.suggestion}
                          onClick={() => setInput(suggestions[1])}
                        >
                          {suggestions[1]}
                        </div>
                      </div>
                      <div className={styles.suggestionsRow}>
                        <div
                          className={styles.suggestion}
                          onClick={() => setInput(suggestions[2])}
                        >
                          {suggestions[2]}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`${styles.messageBubble} ${
                msg.role === 'user'
                  ? styles.userBubble
                  : styles.assistantBubble
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
          <div className={styles.status}>
            Estás hablando con Igor v1.0.0
          </div>
        </div>
      </div>
    );
  }
);

export default IgorChat;
