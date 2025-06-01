'use client'

import { useEffect, useState } from 'react'
import styles from './QueryBubble.module.css'
import { supabase } from '@/lib/supabaseClient'
import NoteBox from './NoteBox'

interface Query {
  id: string
  text: string
  x_position: number
  y_position: number
}

interface Note {
  id: string
  content: string
  x_position: number
  y_position: number
  width: number
  height: number
}

export default function IgorBubbles() {
  const [bubbles, setBubbles] = useState<Query[]>([])
  const [notes, setNotes] = useState<Note[]>([])

  // Cargar pelotitas y notas
  useEffect(() => {
    const fetchData = async () => {
      const { data: queries } = await supabase.from('dashboard_queries').select('*')
      const { data: notes } = await supabase.from('dashboard_notes').select('*')
      setBubbles(queries || [])
      setNotes(notes || [])
    }
    fetchData()
  }, [])

  // Crear una nueva nota
  const handleAddNote = async () => {
    const { data, error } = await supabase.from('dashboard_notes').insert([
      {
        content: '',
        x_position: 200,
        y_position: 200,
        width: 200,
        height: 100,
      },
    ]).select()

    if (data) setNotes([...notes, data[0]])
  }

  // Eliminar una nota
  const handleDeleteNote = async (id: string) => {
    await supabase.from('dashboard_notes').delete().eq('id', id)
    setNotes(notes.filter(n => n.id !== id))
  }

  return (
    <>
      {/* Burbujas */}
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className={styles.bubble}
          style={{ left: bubble.x_position, top: bubble.y_position }}
        >
          {bubble.text}
        </div>
      ))}

      {/* Notas */}
      {notes.map((note) => (
        <NoteBox key={note.id} note={note} onDelete={handleDeleteNote} />
      ))}

      {/* Botones */}
      <div className={styles.iconBar}>
        <button className={styles.iconButton} onClick={handleAddNote}>
          T
        </button>
        <button className={styles.iconButton}>
          ✏️
        </button>
      </div>
    </>
  )
}
