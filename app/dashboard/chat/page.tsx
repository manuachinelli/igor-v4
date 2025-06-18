'use client';

import { useState, useEffect, useRef } from 'react';
import ChatHistoryBar from '@/components/ChatHistoryBar';
import IgorHeader from '@/components/IgorHeader';
import IgorChat from '@/components/IgorChat';
import { supabase } from '@/lib/supabaseClient';

export default function ChatPage() {
  const [sessionId, setSessionId] = useState<string>('');
  const [refreshSessions, setRefreshSessions] = useState(0);
  const chatRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initSession = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id;
      if (!userId) return;

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
    chatRef.current?.resetChat();
    if (typeof window === 'undefined') return;

    const newSessionId = crypto.randomUUID();
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user.id;

    if (!userId) {
      console.error('No se encontró el user ID');
      return;
    }

    const { error } = await supabase
      .from('chat_sessions')
      .insert({
        session_id: newSessionId,
        user_id: userId,
        started_at: new Date().toISOString(),
        current_agent: null,
      });

    if (error) {
      console.error('Error al crear sesión en Supabase:', error);
      return;
    }

    localStorage.setItem('igor_session', newSessionId);
    setSessionId(newSessionId);
    setRefreshSessions((prev) => prev + 1);
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
          refreshTrigger={refreshSessions}
        />
      </div>
    </div>
  );
}

