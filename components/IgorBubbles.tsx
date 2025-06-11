'use client'

import { useEffect, useState } from 'react'
import styles from './IgorBubbles.module.css'
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
  const [inputValue, setInputValue] = useState('')
  const [showInput, setShowInput] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [bubbleColor, setBubbleColor] = useState('#2c2c2c') // color elegido

  const darkColorOptions = ['#1e1e1e', '#2c2c2c', '#3b3b3b', '#2a2a40', '#1f2d3d']

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
    const isTyping = (e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA'
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

  const handleSubmit = async () => {
    if (!inputValue || !userId) return

    const tempId = `temp-${Date.now()}`
    const tempBubble: Bubble = {
      id: tempId,
      user_id: userId,
      query_text: inputValue,
      title: 'Título',
      value: 'Cargando...',
      x_position: 150,
      y_position: 150,
      width: 200,
      height: 120,
      color: bubbleColor,
      is_editable: true,
    }

    setBubbles((prev) => [...prev, tempBubble])
    setInputValue('')
    setShowInput(false)

  await fetch('https://manuachinelli.app.n8n.cloud/webhook/8b913fc3-69df-43c7-9874-1b6a9a697680', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_id: userId,
    query: inputValue,
    color: bubbleColor, // ✅ incluí el color elegido
  }),
})


    setTimeout(() => fetchBubbles(userId), 4000)
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
  }

  return (
    <div className={styles.canvas}>
      {/* Zona izquierda: pelotitas y notas */}
      <div style={{ flex: 1, position: 'relative' }}>
        {bubbles.map(b => (
          <QueryBubble key={b.id} bubble={b} onDelete={handleDeleteBubble} />
        ))}
        {notes.map(n => (
          <NoteBox key={n.id} note={n} onDelete={handleDeleteNote} />
        ))}

        {showInput && (
          <div className={styles.inputOverlay}>
            <input
              type="text"
              placeholder="¿Qué querés saber?"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
              {darkColorOptions.map((color) => (
                <button
                  key={color}
                  onClick={() => setBubbleColor(color)}
                  style={{
                    backgroundColor: color,
                    border: bubbleColor === color ? '2px solid white' : '1px solid #666',
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    cursor: 'pointer',
                  }}
                  title={`Color: ${color}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Zona derecha: barra de botones */}
      <div className={styles.floatingPanel}>
        <div className={styles.buttonGroup}>
          <button className={styles.floatingButton} onClick={() => setShowInput(true)}>+</button>
          <button className={styles.textButton} onClick={createNote}>T</button>
          <button className={styles.pencilButton}>✎</button>
        </div>
      </div>
    </div>
  )
}
