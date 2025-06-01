'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import QueryBubble from './QueryBubble';
import NoteBox from './NoteBox';
import './IgorBubbles.css';

interface Bubble {
  id: string;
  x: number;
  y: number;
  title: string;
  value: string;
  width: number;
  height: number;
  color: string;
  user_id: string;
}

interface Note {
  id: string;
  content: string;
  x_position: number;
  y_position: number;
  width: number;
  height: number;
  user_id: string;
}

export default function IgorBubbles() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const user_id = session.user.id;
      setUserId(user_id);

      const { data: bubbleData } = await supabase
        .from('dashboard_queries')
        .select('*')
        .eq('user_id', user_id);

      const bubblesFormatted: Bubble[] = (bubbleData || []).map((b: any) => ({
        id: b.id,
        x: b.x_position || 100,
        y: b.y_position || 100,
        title: b.title || '',
        value: b.value || '',
        width: b.width || 200,
        height: b.height || 100,
        color: b.color || '#999',
        user_id: b.user_id || '',
      }));
      setBubbles(bubblesFormatted);

      const { data: noteData } = await supabase
        .from('dashboard_notes')
        .select('*')
        .eq('user_id', user_id);

      setNotes(noteData || []);
    };

    fetchData();
  }, []);

  const createNewNote = async () => {
    const { data, error } = await supabase
      .from('dashboard_notes')
      .insert({
        content: '',
        x_position: 150,
        y_position: 150,
        width: 200,
        height: 100,
        user_id: userId,
      })
      .select()
      .single();

    if (!error && data) {
      setNotes(prev => [...prev, data]);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'T') {
      e.preventDefault();
      createNewNote();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [userId]);

  return (
    <>
      {bubbles.map((bubble) => (
        <QueryBubble
          key={bubble.id}
          bubble={bubble}
          onDelete={(id) =>
            setBubbles((prev) => prev.filter((b) => b.id !== id))
          }
        />
      ))}
      {notes.map((note) => (
        <NoteBox key={note.id} {...note} />
      ))}
    </>
  );
}
