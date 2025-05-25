'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, SendHorizontal } from 'lucide-react';
import styles from './IgorChat.module.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function IgorChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isWaiting, setIsWaiting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!input.trim() || isWaiting) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setIsWaiting(true);

    try {
      const res = await fetch('https://manuachinelli.app.n8n.cloud/webhook/d6a72405-e6de-4e91-80da-921b957633dd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, userId: 'igor_user_001' }),
      });

      const data = await res.json();
      const reply = data.reply || 'Ocurrió un error. Intentá de nuevo.';

      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error al contactar con Igor.' }]);
    } finally {
      setIsWaiting(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chatContainer">
      <div className="messagesContainer">
        {messages.map((msg, index) => (
          <div key={index} className={`messageWrapper ${msg.role === 'user' ? 'userWrapper' : 'assistantWrapper'}`}>
            <div className={`messageBubble ${msg.role === 'user' ? 'userBubble' : 'assistantBubble'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="inputSection">
        <div className="inputBox">
          <input
            className="input"
            type="text"
            placeholder="Escribí tu mensaje..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            disabled={isWaiting}
          />
          <button
            className={`iconButton ${isWaiting ? 'disabled' : ''}`}
            onClick={sendMessage}
            disabled={isWaiting}
          >
            <SendHorizontal size={18} />
          </button>
          <button className="iconButton disabled">
            <Mic size={18} />
          </button>
        </div>
        <div className="status">Estás hablando con Igor v1.0.0</div>
      </div>
    </div>
  );
}
