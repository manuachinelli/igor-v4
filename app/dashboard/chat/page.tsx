// app/dashboard/chat/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import ChatHistoryBar from '@/components/ChatHistoryBar';
import IgorHeader from '@/components/IgorHeader';
import IgorChat from '@/components/IgorChat';

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
        <IgorHeader />
        <div className="flex-1 overflow-auto">
          {/* Aquí van los mensajes de IgorChat */}
        </div>
        <div className="border-t border-gray-700 h-80">
          <IgorChat ref={chatRef} sessionId={sessionId} />
        </div>
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
