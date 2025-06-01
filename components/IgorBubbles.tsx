'use client'

import { useEffect, useState } from 'react'
import styles from './QueryBubble.module.css'
import NoteBox from './NoteBox'
import { supabase } from '@/lib/supabaseClient'

interface Query {
  id: string
  text: string
  x: number
  y: number
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
  const [queries, setQueries] = useState<Query[]>([])
  const [notes, setNotes] = useState<Note[]>([])

  // Cargar notas de Supabase
  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    const { data, error } = await supabase.from('dashboard_notes').select('*')
    if (!error && data) setNotes(data)
  }

  const addNote = async () => {
    const { data, error } = await supabase.from('dashboard_notes').insert([
      {
        content: '',
        x_position: 100 + Math.random() * 200,
        y_position: 100 + Math.random() * 200,
        width: 200,
        height: 100
      }
    ]).select()

    if (!error && data && data[0]) {
      setNotes(prev => [...prev, data[0]])
    }
  }

  const deleteNote = async (id: string) => {
    await supabase.from('dashboard_notes').delete().eq('id', id)
    setNotes(prev => prev.filter(n => n.id !== id))
  }

  // Manejar tecla T para agregar nota
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 't' || e.key === 'T') {
        addNote()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <div className={styles.container}>
      {/* Burbujas de query */}
      {queries.map((query) => (
        <div
          key={query.id}
          className={styles.bubble}
          style={{ left: query.x, top: query.y }}
        >
          {query.text}
        </div>
      ))}

      {/* Notas flotantes */}
      {notes.map((note) => (
        <NoteBox key={note.id} note={note} onDelete={deleteNote} />
      ))}
    </div>
  )
}
