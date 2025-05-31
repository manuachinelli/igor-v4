'use client';

import { useState, useEffect } from 'react';
import IgorChat, { IgorChatHandle } from './IgorChat';
import ChatHistoryBar from './ChatHistoryBar';

export default function ChatPage() {
  const [currentSession, setCurrentSession] = useState<string>('');
  const chatRef = useRef<IgorChatHandle>(null);

  // Al montar: si no existe session guardada, dejar en blanco
  useEffect(() => {
    const existing = localStorage.getItem('igor_session');
    if (existing) setCurrentSession(existing);
  }, []);

  const handleNewChat = () => {
    // Limpiar session actual en IgorChat
    chatRef.current?.resetChat();
    // El resetChat guardará nuevo sessionId en localStorage y en IgorChat
    // Luego releyendo localStorage, podríamos setear state para forzar recarga:
    const newId = localStorage.getItem('igor_session') || '';
    setCurrentSession(newId);
  };

  const handleSelectSession = (sessionId: string) => {
    // Actualizar localStorage y state para que IgorChat recargue
    localStorage.setItem('igor_session', sessionId);
    setCurrentSession(sessionId);
    // Opcional: llamar a resetChat en IgorChat para forzar recarga
    chatRef.current?.resetChat();
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <ChatHistoryBar onNewChat={handleNewChat} onSelectSession={handleSelectSession} />
      <div style={{ flex: 1 }}>
        <IgorChat ref={chatRef} />
      </div>
    </div>
  );
}
