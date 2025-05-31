'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, ChevronLeft, ChevronRight, Sparkles, Loader2 } from 'lucide-react';
import styles from './ChatHistoryBar.module.css';
import { supabase } from '@/lib/supabaseClient';

interface Session {
  session_id: string;
  summary: string | null;
  updated_at: string;
}

interface ChatHistoryBarProps {
  onNewChat: () => void;
  onSelectSession: (sessionId: string) => void;
  refreshTrigger: number;
}

export default function ChatHistoryBar({
  onNewChat,
  onSelectSession,
  refreshTrigger,
}: ChatHistoryBarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [uuid, setUuid] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user.id) setUuid(session.user.id);
    });
  }, []);

  useEffect(() => {
    if (!uuid) return;

    const fetchSessions = async () => {
      const { data: allSessions, error: sessError } = await supabase
        .from('chat_sessions')
        .select('session_id, summary, updated_at')
        .eq('user_id', uuid)
        .order('updated_at', { ascending: false });

      if (sessError || !allSessions) {
        console.error('Error al cargar sesiones:', sessError);
        return;
      }

      const { data: msgData, error: msgError } = await supabase
        .from('chat_messages')
        .select('session_id')
        .eq('user_id', uuid);

      if (msgError || !msgData) {
        console.error('Error al cargar mensajes:', msgError);
        return;
      }

      const sessionMsgCount: Record<string, number> = {};
      msgData.forEach((m) => {
        sessionMsgCount[m.session_id] = (sessionMsgCount[m.session_id] || 0) + 1;
      });

      const filtered = allSessions.filter((s) => (sessionMsgCount[s.session_id] || 0) >= 3);
      setSessions(filtered as Session[]);
    };

    fetchSessions();
  }, [uuid, refreshTrigger]);

  const handleGenerateSummary = async (sessionId: string) => {
    setLoadingSummary(sessionId);
    try {
      const res = await fetch('/api/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });

      const json = await res.json();
      console.log('🧠 Respuesta de /api/summary:', json);

      if (!json.ok) {
        console.error('❌ Error al generar resumen:', json.message);
      }
    } catch (err) {
      console.error('❌ Error de red al generar resumen:', err);
    } finally {
      setLoadingSummary(null);
      window.location.reload(); // o usar setRefreshSessions(prev => prev + 1);
    }
  };

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
              <div className={styles.sessionTitleWrapper}>
                <div className={styles.sessionTitle}>
                  {s.summary
                    ? s.summary.slice(0, 30) + (s.summary.length > 30 ? '…' : '')
                    : `Chat ${s.session_id.slice(0, 8)}…`}
                </div>
                <button
                  className={styles.sparkleButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGenerateSummary(s.session_id);
                  }}
                  title="Renombrar con IA"
                >
                  {loadingSummary === s.session_id ? (
                    <Loader2 className={styles.spinner} size={16} />
                  ) : (
                    <Sparkles size={16} />
                  )}
                </button>
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
