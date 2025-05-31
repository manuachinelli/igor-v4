// components/ChatPage.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import IgorChat from './IgorChat';
import ChatHistoryBar from './ChatHistoryBar';

export default function ChatPage() {
  const [sessionId, setSessionId] = useState<string>('');
  const chatRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const existing = localStorage.getItem('igor_session');
    if (existing) setSessionId(existing);
  }, []);

  const handleNewChat = () => {
    chatRef.current?.resetChat();
    if (typeof window === 'undefined') return;
    setSessionId(localStorage.getItem('igor_session') || '');
  };

  const handleSelectSession = (sid: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('igor_session', sid);
      setSessionId(sid);
    }
    chatRef.current?.resetChat();
  };

  return (
    <div className="flex h-screen bg-black text-white">
      {/* IZQUIERDA: tu chat */}
      <div className="flex flex-col flex-1">
        <IgorChat ref={chatRef} sessionId={sessionId} />
      </div>

      {/* DERECHA: historial de sesiones */}
      <div className="w-64 bg-gray-900 border-l border-gray-700">
        <ChatHistoryBar
          onNewChat={handleNewChat}
          onSelectSession={handleSelectSession}
        />
      </div>
    </div>
  );
}
