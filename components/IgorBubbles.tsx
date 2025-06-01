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

  useEffect(() => {
    fetchData()
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 't' || e.key === 'T') {
        createNote()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  async function fetchData() {
    const userId = localStorage.getItem('igor_user_id')
    if (!userId) return

    const { data: queryData } = await supabase
      .from('dashboard_queries')
      .select('*')
      .eq('user_id', userId)

    const { data: noteData } = await supabase
      .from('dashboard_notes')
      .select('*')
      .eq('user_id', userId)

    setBubbles(queryData || [])
    setNotes(noteData || [])
  }

  async function createBubble() {
    const userId = localStorage.getItem('igor_user_id')
    if (!userId) return

    const { data, error } = await supabase.from('dashboard_queries').insert({
      user_id: userId,
      title: '',
      value: '',
      x_position: 300,
      y_position: 300,
      width: 200,
      height: 100,
      color: '#cccccc',
    }).select()

    if (data && !error) {
      setBubbles(prev => [...prev, data[0]])
    }
  }

  async function createNote() {
    const userId = localStorage.getItem('igor_user_id')
    if (!userId) return

    const { data, error } = await supabase.from('dashboard_notes').insert({
      user_id: userId,
      content: '',
      x_position: 500,
      y_position: 300,
      width: 200,
      height: 100,
    }).select()

    if (data && !error) {
      setNotes(prev => [...prev, data[0]])
    }
  }

  return (
    <>
      <div className="absolute right-[100px] top-1/2 transform -translate-y-1/2 flex flex-col items-center gap-4 z-50">
        <button
          className="w-10 h-10 rounded-full bg-white text-black text-xl"
          onClick={createBubble}
        >
          +
        </button>
        <button
          className="w-10 h-10 rounded-full bg-white text-black text-sm"
          onClick={createNote}
        >
          T
        </button>
        <button
          className="w-10 h-10 rounded-full bg-white text-black text-sm"
          disabled
        >
          ✎
        </button>
      </div>

      {bubbles.map(bubble => (
        <QueryBubble
          key={bubble.id}
          bubble={bubble}
          onDelete={(id) =>
            setBubbles((prev) => prev.filter((b) => b.id !== id))
          }
        />
      ))}

      {notes.map(note => (
        <NoteBox
          key={note.id}
          note={note}
          onDelete={(id) =>
            setNotes((prev) => prev.filter((n) => n.id !== id))
          }
        />
      ))}
    </>
  )
}
