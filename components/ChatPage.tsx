 'use client';

import { useState, useEffect, useRef } from 'react';
import IgorChat from './IgorChat';
import ChatHistoryBar from './ChatHistoryBar';
import IgorHeader from './IgorHeader';
import { supabase } from '@/lib/supabaseClient';

export default function ChatPage() {
  const [sessionId, setSessionId] = useState<string>('');
  const [uuid, setUuid] = useState<string | null>(null);
  const [refreshSessions, setRefreshSessions] = useState(0);
  const chatRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user.id) {
        setUuid(session.user.id);
        const existing = localStorage.getItem('igor_session');
        if (existing) {
          setSessionId(existing);
        }
      }
    });
  }, []);

  const handleNewChat = async () => {
    if (!uuid) return;
    const newSessionId = crypto.randomUUID();
    chatRef.current?.resetChat();

    try {
      const { error: insertError } = await supabase
        .from('chat_sessions')
        .insert({ session_id: newSessionId, user_id: uuid });

      if (insertError) {
        console.error('Error al crear nueva sesión:', insertError);
        return;
      }

      localStorage.setItem('igor_session', newSessionId);
      setSessionId(newSessionId);
      setRefreshSessions((prev) => prev + 1);
    } catch (e) {
      console.error('Exception creando nueva sesión:', e);
    }
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
      <div className="flex flex-col flex-1">
        <IgorHeader />
        <div className="flex-1 overflow-auto" />
        <div className="border-t border-gray-700 h-80">
          <IgorChat ref={chatRef} sessionId={sessionId} />
        </div>
      </div>

      <div className="w-64 bg-gray-900 border-l border-gray-700">
        <ChatHistoryBar
          onNewChat={handleNewChat}
          onSelectSession={handleSelectSession}
          refreshTrigger={refreshSessions}
        />
      </div>
    </div>
  );
}
