'use client'

import { useEffect, useState } from 'react'
import styles from './IgorChat.module.css'
import QueryBubble from './QueryBubble'
import NoteBox from './NoteBox'
import { supabase } from '@/lib/supabaseClient'
import { v4 as uuidv4 } from 'uuid'

type Bubble = {
  id: string
  user_id: string
  text: string
  x_position: number
  y_position: number
}

type Note = {
  id: string
  user_id: string
  content: string
  x_position: number
  y_position: number
  width: number
  height: number
}

export default function IgorBubbles() {
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const fetchSessionAndData = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession()
      const uid = session?.user.id
      if (!uid) return
      setUserId(uid)

      const { data: bubbleData } = await supabase
        .from('dashboard_queries')
        .select('*')
        .eq('user_id', uid)

      const { data: noteData } = await supabase
        .from('dashboard_notes')
        .select('*')
        .eq('user_id', uid)

      if (bubbleData) setBubbles(bubbleData)
      if (noteData) setNotes(noteData)
    }

    fetchSessionAndData()
  }, [])

  const handleAddBubble = async () => {
    if (!userId) return
    const newBubble: Bubble = {
      id: uuidv4(),
      user_id: userId,
      text: '',
      x_position: Math.floor(Math.random() * 500),
      y_position: Math.floor(Math.random() * 300)
    }

    const { data, error } = await supabase
      .from('dashboard_queries')
      .insert([newBubble])

    if (!error && data) {
      setBubbles(prev => [...prev, newBubble])
    }
  }

  const handleAddNote = async () => {
    if (!userId) return
    const newNote: Note = {
      id: uuidv4(),
      user_id: userId,
      content: '',
      x_position: Math.floor(Math.random() * 500),
      y_position: Math.floor(Math.random() * 300),
      width: 200,
      height: 100
    }

    const { data, error } = await supabase
      .from('dashboard_notes')
      .insert([newNote])

    if (!error && data) {
      setNotes(prev => [...prev, newNote])
    }
  }

  const handleDeleteNote = async (id: string) => {
    await supabase.from('dashboard_notes').delete().eq('id', id)
    setNotes(prev => prev.filter(note => note.id !== id))
  }

  const handleUpdateNote = async (id: string, content: string) => {
    await supabase
      .from('dashboard_notes')
      .update({ content })
      .eq('id', id)
  }

  return (
    <div className={styles.bubbleWrapper}>
      {bubbles.map(bubble => (
        <QueryBubble
          key={bubble.id}
          bubble={bubble}
          onDelete={() =>
            setBubbles(prev => prev.filter(b => b.id !== bubble.id))
          }
        />
      ))}

      {notes.map(note => (
        <NoteBox
          key={note.id}
          note={note}
          onDelete={handleDeleteNote}
          onUpdate={handleUpdateNote}
        />
      ))}

      <div className={styles.bubbleToolbar}>
        <img
          src="/sidebar-icons/plus.png"
          alt="Add Bubble"
          onClick={handleAddBubble}
          className={styles.bubbleIcon}
        />
        <img
          src="/sidebar-icons/text.png"
          alt="Add Note"
          onClick={handleAddNote}
          className={styles.bubbleIcon}
        />
        <img
          src="/sidebar-icons/pencil.png"
          alt="Edit"
          className={styles.bubbleIcon}
        />
      </div>
    </div>
  )
}
