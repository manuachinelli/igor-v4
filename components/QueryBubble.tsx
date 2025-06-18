'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import QueryBubble, { Bubble } from './QueryBubble'
import NoteBox, { Note } from './NoteBox'

export default function IgorBubbles() {
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedBubbleId, setSelectedBubbleId] = useState<string | null>(null)

  // Fetch bubbles
  useEffect(() => {
    const fetchBubbles = async () => {
      const { data: userData } = await supabase.auth.getUser()
      const user_id = userData?.user?.id
      if (!user_id) return

      const { data, error } = await supabase
        .from('dashboard_queries')
        .select('*')
        .eq('user_id', user_id)

      if (!error && data) {
        setBubbles(data)
      }
    }

    fetchBubbles()
  }, [])

  // Fetch notes
  useEffect(() => {
    const fetchNotes = async () => {
      const { data: userData } = await supabase.auth.getUser()
      const user_id = userData?.user?.id
      if (!user_id) return

      const { data, error } = await supabase
        .from('dashboard_notes')
        .select('*')
        .eq('user_id', user_id)

      if (!error && data) {
        setNotes(data)
      }
    }

    fetchNotes()
  }, [])

  const handleDeleteBubble = async (id: string) => {
    await supabase.from('dashboard_queries').delete().eq('id', id)
    setBubbles(prev => prev.filter(b => b.id !== id))
    if (selectedBubbleId === id) setSelectedBubbleId(null)
  }

  const handleDeleteNote = async (id: string) => {
    await supabase.from('dashboard_notes').delete().eq('id', id)
    setNotes(prev => prev.filter(n => n.id !== id))
  }

  const handleUpdateBubble = async (id: string, data: Partial<Bubble>) => {
    await supabase.from('dashboard_queries').update(data).eq('id', id)
    setBubbles(prev =>
      prev.map(b => (b.id === id ? { ...b, ...data } : b))
    )
  }

  return (
    <div
      style={{ flex: 1, position: 'relative' }}
      onClick={() => setSelectedBubbleId(null)}
    >
      {bubbles.map(b => (
        <QueryBubble
          key={b.id}
          bubble={b}
          onDelete={handleDeleteBubble}
          isSelected={selectedBubbleId === b.id}
          onSelect={() => setSelectedBubbleId(b.id)}
          onDeselect={() => setSelectedBubbleId(null)}
          onUpdate={handleUpdateBubble}
        />
      ))}
      {notes.map(n => (
        <NoteBox key={n.id} note={n} onDelete={handleDeleteNote} />
      ))}
    </div>
  )
}
