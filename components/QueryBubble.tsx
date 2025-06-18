'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import QueryBubble from './QueryBubble'
import NoteBox from './NoteBox'
import { v4 as uuidv4 } from 'uuid'

type Bubble = {
  id: string
  user_id: string
  title: string
  value: string
  color: string
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
  const [selectedBubbleId, setSelectedBubbleId] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const { data: userData } = await supabase.auth.getUser()
      const uid = userData?.user?.id
      if (!uid) return
      setUserId(uid)

      const { data: bubblesData } = await supabase
        .from('dashboard_queries')
        .select('*')
        .eq('user_id', uid)
      setBubbles(bubblesData || [])

      const { data: notesData } = await supabase
        .from('dashboard_notes')
        .select('*')
        .eq('user_id', uid)
      setNotes(notesData || [])
    }

    fetchData()
  }, [])

  const handleAddBubble = async () => {
    if (!userId) return
    const newBubble: Bubble = {
      id: uuidv4(),
      user_id: userId,
      title: 'Nueva consulta',
      value: '',
      color: 'yellow',
      x_position: 100,
      y_position: 100,
    }

    const { error } = await supabase.from('dashboard_queries').insert([newBubble])
    if (!error) setBubbles((prev) => [...prev, newBubble])
  }

  const handleDeleteBubble = async (id: string) => {
    await supabase.from('dashboard_queries').delete().eq('id', id)
    setBubbles((prev) => prev.filter((b) => b.id !== id))
    setSelectedBubbleId(null)
  }

  const handleUpdateBubble = async (id: string, updatedFields: Partial<Bubble>) => {
    const updated = bubbles.map((b) => (b.id === id ? { ...b, ...updatedFields } : b))
    setBubbles(updated)
    await supabase.from('dashboard_queries').update(updatedFields).eq('id', id)
  }

  const handleDeleteNote = async (id: string) => {
    await supabase.from('dashboard_notes').delete().eq('id', id)
    setNotes((prev) => prev.filter((n) => n.id !== id))
  }

  const handleAddNote = async () => {
    if (!userId) return
    const newNote: Note = {
      id: uuidv4(),
      user_id: userId,
      content: '',
      x_position: 100,
      y_position: 100,
      width: 200,
      height: 100,
    }

    const { error } = await supabase.from('dashboard_notes').insert([newNote])
    if (!error) setNotes((prev) => [...prev, newNote])
  }

  return (
    <div
      style={{ flex: 1, position: 'relative' }}
      onClick={(e) => {
        if ((e.target as HTMLElement).id === 'canvas-area') {
          setSelectedBubbleId(null)
        }
      }}
    >
      <div id="canvas-area" style={{ width: '100%', height: '100%', position: 'absolute' }}>
        {bubbles.map((b) => (
          <QueryBubble
            key={b.id}
            bubble={b}
            isSelected={selectedBubbleId === b.id}
            onSelect={() => setSelectedBubbleId(b.id)}
            onDeselect={() => setSelectedBubbleId(null)}
            onUpdate={(updated) => handleUpdateBubble(b.id, updated)}
            onDelete={handleDeleteBubble}
          />
        ))}

        {notes.map((n) => (
          <NoteBox key={n.id} note={n} onDelete={handleDeleteNote} />
        ))}

        <button
          onClick={handleAddBubble}
          style={{
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '10px 20px',
            backgroundColor: '#0ea5e9',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            zIndex: 10,
          }}
        >
          +
        </button>

        <button
          onClick={handleAddNote}
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            padding: '10px 14px',
            backgroundColor: '#fff',
            color: '#000',
            border: '1px solid #ccc',
            borderRadius: 6,
            cursor: 'pointer',
            zIndex: 10,
            fontWeight: 500,
          }}
        >
          T
        </button>
      </div>
    </div>
  )
}
