'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import styles from './IgorChat.module.css'
import QueryBubble from './QueryBubble'
import NoteBox from './NoteBox'

export type Bubble = {
  id: string
  text: string
  x_position: number
  y_position: number
}

export type Note = {
  id: string
  content: string
  x_position: number
  y_position: number
}

export default function IgorBubbles() {
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const [notes, setNotes] = useState<Note[]>([])

  useEffect(() => {
    fetchBubbles()
    fetchNotes()
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'T') createNote()
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  const fetchBubbles = async () => {
    const { data, error } = await supabase.from('bubbles').select('*')
    if (!error && data) setBubbles(data)
  }

  const fetchNotes = async () => {
    const { data, error } = await supabase.from('notes').select('*')
    if (!error && data) setNotes(data)
  }

  const createNote = async () => {
    const { data, error } = await supabase
      .from('notes')
      .insert({ content: 'New note', x_position: 100, y_position: 100 })
      .select()
      .single()

    if (!error && data) setNotes(prev => [...prev, data])
  }

  const handleDeleteNote = async (id: string) => {
    await supabase.from('notes').delete().eq('id', id)
    setNotes(prev => prev.filter(note => note.id !== id))
  }

  const handleUpdateNote = async (id: string, x: number, y: number) => {
    await supabase.from('notes').update({ x_position: x, y_position: y }).eq('id', id)
    setNotes(prev =>
      prev.map(note =>
        note.id === id ? { ...note, x_position: x, y_position: y } : note
      )
    )
  }

  return (
    <div className={styles.igorContainer}>
      {bubbles.map(bubble => (
        <QueryBubble
          key={bubble.id}
          id={bubble.id}
          text={bubble.text}
          x={bubble.x_position}
          y={bubble.y_position}
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
    </div>
  )
}
