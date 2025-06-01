'use client'

import { useEffect, useState } from 'react'
import QueryBubble from './QueryBubble'
import NoteBox from './NoteBox'
import { supabase } from '@/lib/supabaseClient'

interface Bubble {
  id: string
  user_id: string
  title: string
  value: string
  x_position: number
  y_position: number
  width: number
  height: number
  color: string
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
        title: 'Nuevo query',
        value: 'Cargando...',
        x_position: 200,
        y_position: 200,
        width: 200,
        height: 120,
        color: '#333',
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
    <div style={{ width: '100vw', height: '100vh', backgroundColor: 'black', position: 'relative', overflow: 'hidden' }}>
      {/* Burbujas */}
      {bubbles.map(b => (
        <QueryBubble key={b.id} bubble={b} onDelete={handleDeleteBubble} />
      ))}

      {/* Notas */}
      {notes.map(n => (
        <NoteBox key={n.id} note={n} onDelete={handleDeleteNote} />
      ))}

      {/* Botones flotantes */}
      <div style={{ position: 'absolute', top: 20, left: 20, display: 'flex', flexDirection: 'row', gap: 10, zIndex: 100 }}>
        <button onClick={createBubble} style={{ width: 32, height: 32 }}>+</button>
        <button onClick={createNote} style={{ width: 32, height: 32 }}>T</button>
      </div>
    </div>
  )
}

