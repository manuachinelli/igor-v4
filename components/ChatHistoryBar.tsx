'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './ChatHistoryBar.module.css';
import { supabase } from '@/lib/supabaseClient';

interface Session {
  session_id: string;
  summary: string | null;
  updated_at: string;
}

export default function ChatHistoryBar({
  onNewChat,
  onSelectSession,
}: {
  onNewChat: () => void;
  onSelectSession: (sessionId: string) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);

  // Leer el UUID del usuario autenticado
  const [uuid, setUuid] = useState<string | null>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user.id) setUuid(session.user.id);
    });
  }, []);

  // Cada vez que cambie uuid, cargar las sesiones del usuario
  useEffect(() => {
    if (!uuid) return;

    const fetchSessions = async () => {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('session_id, summary, updated_at')
        .eq('user_id', uuid)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error al cargar sesiones:', error);
        return;
      }
      setSessions(data as Session[]);
    };
    fetchSessions();
  }, [uuid]);

  return (
    <div className={`${styles.chatHistoryBar} ${collapsed ? styles.collapsed : ''}`}>
      <div className={styles.topSection}>
        <Image
          src="/sidebar-icons/chat.png"
          alt="Chat"
          width={48}
          height={48}
          className={styles.logo}
        />
        {!collapsed && (
          <button className={styles.iconButton} onClick={onNewChat}>
            <Plus size={20} />
          </button>
        )}
      </div>

      {!collapsed && (
        <ul className={styles.sessionList}>
          {sessions.map((s) => (
            <li
              key={s.session_id}
              className={styles.sessionItem}
              onClick={() => onSelectSession(s.session_id)}
            >
              <div className={styles.sessionTitle}>
                {s.summary
                  ? s.summary.slice(0, 30) + (s.summary.length > 30 ? '…' : '')
                  : `Chat ${s.session_id.slice(0, 8)}…`}
              </div>
              <div className={styles.sessionDate}>
                {new Date(s.updated_at).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}

      <button className={styles.toggleButton} onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>
    </div>
  );
}
