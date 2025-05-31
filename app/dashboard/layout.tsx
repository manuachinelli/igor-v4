'use client';

import '../globals.css';
import { useState, useRef, useEffect } from 'react';
import ChatHistoryBar from '@/components/ChatHistoryBar';
import IgorChat, { IgorChatHandle } from '@/components/IgorChat';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sessionId, setSessionId] = useState<string>('');
  const chatRef = useRef<IgorChatHandle>(null);

  // Al montar, leer sessionId en localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const existing = localStorage.getItem('igor_session');
    if (existing) setSessionId(existing);
  }, []);

  // Nuevo chat: resetea en IgorChat y actualiza sessionId
  const handleNewChat = () => {
    chatRef.current?.resetChat();
    if (typeof window === 'undefined') return;
    const newId = localStorage.getItem('igor_session') || '';
    setSessionId(newId);
  };

  // Seleccionar sesión: guarda sessionId y resetea IgorChat
  const handleSelectSession = (sid: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('igor_session', sid);
      setSessionId(sid);
    }
    chatRef.current?.resetChat();
  };

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {/* 1) Aquí va la barra lateral de sesiones */}
      <ChatHistoryBar
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
      />

      {/* 2) Área principal de /dashboard */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* 2.1) Contenido de la página /dashboard */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {children}
        </div>

        {/* 2.2) IgorChat fijo en la parte inferior */}
        <div style={{ borderTop: '1px solid #444', height: '350px' }}>
          <IgorChat ref={chatRef} />
        </div>
      </div>
    </div>
  );
}
