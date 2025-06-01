'use client'

import { useEffect, useState } from 'react'
import styles from './IgorBubbles.module.css'
import NoteBox from './NoteBox'
import { supabase } from '@/lib/supabaseClient'

interface Note {
  id: string
  content: string
  x_position: number
  y_position: number
  width: number
  height: number
}

export default function IgorBubbles() {
  const [notes, setNotes] = useState<Note[]>([])

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    const { data, error } = await supabase.from('dashboard_notes').select('*')
    if (!error && data) setNotes(data)
  }

  const createNote = async () => {
    const { data, error } = await supabase.from('dashboard_notes').insert({
      content: '',
      x_position: 200,
      y_position: 200,
      width: 200,
      height: 120
    }).select().single()

    if (!error && data) setNotes(prev => [...prev, data])
  }

  const handleNoteDelete = async (id: string) => {
    await supabase.from('dashboard_notes').delete().eq('id', id)
    setNotes(prev => prev.filter(note => note.id !== id))
  }

  return (
    <div className={styles.container}>
      {/* Botones flotantes */}
      <div className={styles.toolbox}>
        <button className={styles.toolboxButton} onClick={createNote}>T</button>
        <button className={styles.toolboxButton}>✏️</button>
      </div>

      {/* Notas */}
      {notes.map(note => (
        <NoteBox key={note.id} note={note} onDelete={handleNoteDelete} />
      ))}
    </div>
  )
}
