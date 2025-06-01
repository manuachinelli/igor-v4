'use client'

import { useEffect, useState } from 'react'
import styles from './IgorChat.module.css'
import QueryBubble from './QueryBubble'
import NoteBox from './NoteBox'
import { supabase } from '@/lib/supabaseClient'

interface Bubble {
  id: string
  user_id: string
  query_text: string
  title: string
  value: string
  x_position: number
  y_position: number
  width: number
  height: number
  color: string
  is_editable: boolean
}

interface Note {
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
    const load = async () => {
      const { data: userData } = await supabase.auth.getUser()
      const id = userData?.user?.id
      if (!id) return
      setUserId(id)
      fetchBubbles(id)
      fetchNotes(id)
    }
    load()

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const fetchBubbles = async (uid: string) => {
    const { data } = await supabase
      .from('dashboard_queries')
      .select('*')
      .eq('user_id', uid)
    if (data) setBubbles(data as Bubble[])
  }

  const fetchNotes = async (uid: string) => {
    const { data } = await supabase
      .from('dashboard_notes')
      .select('*')
      .eq('user_id', uid)
    if (data) setNotes(data as Note[])
  }

  const createBubble = async () => {
    if (!userId) return
    const { data } = await supabase
      .from('dashboard_queries')
      .insert({
        user_id: userId,
        query_text: 'Nuevo query',
        title: 'Título',
        value: 'Cargando...',
        x_position: 200,
        y_position: 200,
        width: 200,
        height: 120,
        color: '#333',
        is_editable: true
      })
      .select()
    if (data) setBubbles([...bubbles, data[0]])
  }

  const createNote = async () => {
    if (!userId) return
    const { data } = await supabase
      .from('dashboard_notes')
      .insert({
        user_id: userId,
        content: 'Texto libre',
        x_position: 300,
        y_position: 200,
        width: 200,
        height: 120
      })
      .select()
    if (data) setNotes([...notes, data[0]])
  }

  const handleDeleteBubble = async (id: string) => {
    await supabase.from('dashboard_queries').delete().eq('id', id)
    setBubbles(prev => prev.filter(b => b.id !== id))
  }

  const handleDeleteNote = async (id: string) => {
    await supabase.from('dashboard_notes').delete().eq('id', id)
    setNotes(prev => prev.filter(n => n.id !== id))
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key.toLowerCase() === 't') {
      e.preventDefault()
      createNote()
    }
  }

  return (
    <div className={styles.chatContainer}>
      {/* Burbujas */}
      {bubbles.map(b => (
        <QueryBubble key={b.id} bubble={b} onDelete={handleDeleteBubble} />
      ))}

      {/* Notas */}
      {notes.map(n => (
        <NoteBox key={n.id} note={n} onDelete={handleDeleteNote} />
      ))}

      {/* Botón + para pelotitas */}
      <button className={styles.floatingButton} onClick={createBubble}>+</button>
    </div>
  )
}
