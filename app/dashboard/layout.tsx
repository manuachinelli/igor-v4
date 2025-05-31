'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { useState, useRef, useEffect } from 'react';
import ChatHistoryBar from '@/components/ChatHistoryBar';
import IgorChat, { IgorChatHandle } from '@/components/IgorChat';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [sessionId, setSessionId] = useState<string>('');
  const chatRef = useRef<IgorChatHandle>(null);

  // Al montar, leer sessionId guardado
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const existing = localStorage.getItem('igor_session');
    if (existing) setSessionId(existing);
  }, []);

  // Nuevo chat: resetear chat y actualizar sessionId
  const handleNewChat = () => {
    chatRef.current?.resetChat();
    if (typeof window === 'undefined') return;
    const newId = localStorage.getItem('igor_session') || '';
    setSessionId(newId);
  };

  // Seleccionar sesión: guardar en localStorage y resetear chat
  const handleSelectSession = (sid: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('igor_session', sid);
      setSessionId(sid);
    }
    chatRef.current?.resetChat();
  };

  return (
    <html lang="es" className={inter.className}>
      <body
        style={{
          margin: 0,
          backgroundColor: '#000',
          color: '#fff',
          fontFamily: 'inherit',
          display: 'flex',
          height: '100vh',
        }}
      >
        {/* Barra lateral de historial */}
        <ChatHistoryBar
          onNewChat={handleNewChat}
          onSelectSession={handleSelectSession}
        />

        {/* Contenido principal */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, overflow: 'auto' }}>
            {children}
          </div>

          {/* Chat fijo abajo */}
          <div style={{ borderTop: '1px solid #444', height: '350px' }}>
            <IgorChat ref={chatRef} />
          </div>
        </div>
      </body>
    </html>
  );
}
