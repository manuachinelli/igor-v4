'use client';

import { useEffect, useState } from 'react';
import QueryBubble from './QueryBubble';
import NoteBox from './NoteBox';
import { supabase } from '@/lib/supabaseClient';
import styles from './IgorChat.module.css';
import Image from 'next/image';

interface Bubble {
  id: string;
  text: string;
  x_position: number;
  y_position: number;
}

interface Note {
  id: string;
  content: string;
  x_position: number;
  y_position: number;
  width: number;
  height: number;
}

export default function IgorBubbles() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data: bubbleData } = await supabase
        .from('dashboard_queries')
        .select('*')
        .eq('user_id', user.id);

      const { data: noteData } = await supabase
        .from('dashboard_notes')
        .select('*')
        .eq('user_id', user.id);

      setBubbles(bubbleData || []);
      setNotes(noteData || []);
    };

    fetchData();
  }, []);

  const handleAddBubble = async () => {
    const { data, error } = await supabase.from('dashboard_queries').insert({
      user_id: userId,
      text: 'Escribí tu consulta...',
      x_position: 200,
      y_position: 200,
    }).select('*').single();

    if (error || !data) return;
    setBubbles(prev => [...prev, data]);
  };

  const handleAddNote = async () => {
    const { data, error } = await supabase.from('dashboard_notes').insert({
      user_id: userId,
      content: 'Texto libre...',
      x_position: 400,
      y_position: 200,
      width: 200,
      height: 100,
    }).select('*').single();

    if (error || !data) return;
    setNotes(prev => [...prev, data]);
  };

  return (
    <>
      {bubbles.map((bubble) => (
        <QueryBubble
          key={bubble.id}
          bubble={bubble}
          onDelete={(id) => setBubbles(prev => prev.filter(b => b.id !== id))}
        />
      ))}

      {notes.map((note) => (
        <NoteBox
          key={note.id}
          note={note}
          onDelete={(id) => setNotes(prev => prev.filter(n => n.id !== id))}
        />
      ))}

      <div className={styles.rightBar}>
        <Image
          src="/sidebar-icons/add.png"
          alt="Add Bubble"
          width={30}
          height={30}
          onClick={handleAddBubble}
          className={styles.sidebarIcon}
        />
        <Image
          src="/sidebar-icons/edit.png"
          alt="Edit"
          width={30}
          height={30}
          className={styles.sidebarIcon}
        />
        <Image
          src="/sidebar-icons/text.png"
          alt="Add Text"
          width={30}
          height={30}
          onClick={handleAddNote}
          className={styles.sidebarIcon}
        />
      </div>
    </>
  );
}
