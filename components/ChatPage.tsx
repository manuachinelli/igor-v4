'use client';

import { useState, useEffect, useRef } from 'react';
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
    chatRef.current?.resetChat();
    const newId = localStorage.getItem('igor_session') || '';
    setCurrentSession(newId);
  };

  const handleSelectSession = (sessionId: string) => {
    localStorage.setItem('igor_session', sessionId);
    setCurrentSession(sessionId);
    chatRef.current?.resetChat();
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <ChatHistoryBar
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
      />
      <div style={{ flex: 1 }}>
        <IgorChat ref={chatRef} sessionId={currentSession} />
      </div>
    </div>
  );
}
