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

    const initSession = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id;
      if (!userId) return;

      setUuid(userId);
      const existing = localStorage.getItem('igor_session');
      let shouldCreateNew = true;

      if (existing) {
        const { data: existingMessages } = await supabase
          .from('chat_messages')
          .select('id')
          .eq('user_id', userId)
          .eq('session_id', existing)
          .limit(1);

        if (existingMessages && existingMessages.length > 0) {
          setSessionId(existing);
          shouldCreateNew = false;
        }
      }

      if (shouldCreateNew) {
        const newSessionId = crypto.randomUUID();
        await supabase.from('chat_sessions').insert({
          session_id: newSessionId,
          user_id: userId,
          started_at: new Date().toISOString(),
          current_agent: null,
        });
        localStorage.setItem('igor_session', newSessionId);
        setSessionId(newSessionId);
      }
    };

    initSession();
  }, []);

  const handleNewChat = async () => {
    if (!uuid) return;
    const newSessionId = crypto.randomUUID();
    chatRef.current?.resetChat();

    try {
      await supabase.from('chat_sessions').insert({
        session_id: newSessionId,
        user_id: uuid,
        started_at: new Date().toISOString(),
        current_agent: null,
      });

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
