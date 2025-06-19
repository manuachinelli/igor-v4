'use client'

import { useEffect, useState } from 'react'
import styles from './IgorBubbles.module.css'
import QueryBubble from './QueryBubble'
import NoteBox from './NoteBox'
import BubbleModal from './BubbleModal'
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
  const [showInput, setShowInput] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

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

  const handleKeyDown = (e: KeyboardEvent) => {
    const isTyping = (e.target as HTMLElement).isContentEditable || ['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)
    if (!isTyping && e.key.toLowerCase() === 't') {
      e.preventDefault()
      createNote()
    }
  }

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

  const handleSubmit = async (title: string, color: string) => {
    if (!title || !userId) return

    const tempId = `temp-${Date.now()}`
    const tempBubble: Bubble = {
      id: tempId,
      user_id: userId,
      query_text: title,
      title: title,
      value: 'Cargando...',
      x_position: 150,
      y_position: 150,
      width: 200,
      height: 120,
      color: color,
      is_editable: true,
    }

    setBubbles((prev) => [...prev, tempBubble])
    setShowInput(false)

    await fetch('https://manuachinelli.app.n8n.cloud/webhook/8b913fc3-69df-43c7-9874-1b6a9a697680', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        query: title,
        color: color,
      }),
    })

    // Comentamos para evitar sobreescritura con datos viejos
    // setTimeout(() => fetchBubbles(userId), 4000)
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
        height: 120,
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
    setSelectedId(null)
  }

  const handleUpdatePosition = (id: string, x: number, y: number) => {
    setBubbles(prev =>
      prev.map(b => (b.id === id ? { ...b, x_position: x, y_position: y } : b))
    )
  }

  return (
    <div className={styles.canvas} onClick={() => setSelectedId(null)}>
      <div style={{ flex: 1, position: 'relative' }}>
        {bubbles.map(b => (
          <QueryBubble
            key={b.id}
            bubble={b}
            onDelete={handleDeleteBubble}
            onUpdatePosition={handleUpdatePosition}
          />
        ))}
        {notes.map(n => (
          <NoteBox
            key={n.id}
            note={n}
            onDelete={handleDeleteNote}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
          />
        ))}

        {showInput && (
          <BubbleModal
            onCreate={(title, color) => {
              handleSubmit(title, color)
            }}
            onCancel={() => setShowInput(false)}
          />
        )}
      </div>

      <div className={styles.toolbox}>
        <button className={styles.toolButton} onClick={() => setShowInput(true)}>+</button>
        <button className={styles.toolButton} onClick={createNote}>T</button>
        <button className={styles.toolButton}>✎</button>
        <button className={styles.toolButton}>💬</button>
        <button className={styles.toolButton}>🖼️</button>
        <button className={styles.toolButton}>🔀</button>
        <button className={styles.toolButton}>📊</button>
        <button className={styles.toolButton}>↩️</button>
        <button className={styles.toolButton}>🔡</button>
        <button className={styles.toolButton}>🔗</button>
        <button className={styles.toolButton}>📝</button>
        <button className={styles.toolButton}>🗓️</button>
        <button className={styles.toolButton}>✨</button>
        <button className={styles.toolButton}>🧱</button>
      </div>
    </div>
  )
}
