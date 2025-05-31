// components/ChatPage.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import IgorChat from './IgorChat';
import ChatHistoryBar from './ChatHistoryBar';
import IgorHeader from './IgorHeader';
import { supabase } from '@/lib/supabaseClient';

export default function ChatPage() {
  const [sessionId, setSessionId] = useState<string>('');
  const [uuid, setUuid] = useState<string | null>(null);
  const chatRef = useRef<any>(null);

  // 1) Al montar, cargamos uuid y sessionId de localStorage (si existe)
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

  // 2) Cuando el usuario hace clic en “+”, creamos una fila nueva en chat_sessions
  const handleNewChat = async () => {
    // 2.a) Si no tenemos userId todavía, abortamos
    if (!uuid) return;

    // 2.b) Genero un nuevo ID de sesión en el cliente
    const newSessionId = crypto.randomUUID();

    // 2.c) Limpio el chat visible
    chatRef.current?.resetChat();

    // 2.d) Inserto en Supabase incluyendo ese session_id explícito
    try {
      const { error: insertError } = await supabase
        .from('chat_sessions')
        .insert({ session_id: newSessionId, user_id: uuid });

      if (insertError) {
        console.error('Error al crear nueva sesión:', insertError);
        return;
      }

      // 2.e) Guardo en localStorage y en el estado
      localStorage.setItem('igor_session', newSessionId);
      setSessionId(newSessionId);
    } catch (e) {
      console.error('Exception creando nueva sesión:', e);
    }
  };

  // 3) Cuando el usuario selecciona otra sesión de la lista
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
          {/* Aquí podría ir un lugar para mostrar algo arriba, si quisieras */}
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
