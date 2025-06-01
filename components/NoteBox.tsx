'use client'

import { useRef, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import styles from './NoteBox.module.css'

interface Note {
  id: string
  content: string
  x_position: number
  y_position: number
}

export default function NoteBox({ note, onUpdate }: { note: Note, onUpdate: (id: string, x: number, y: number) => void }) {
  const noteRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: note.x_position, y: note.y_position })

  const onDrag = (e: React.MouseEvent) => {
    const startX = e.clientX
    const startY = e.clientY
    const origX = position.x
    const origY = position.y

    const onMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX
      const dy = moveEvent.clientY - startY
      setPosition({ x: origX + dx, y: origY + dy })
    }

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      onUpdate(note.id, position.x, position.y)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  return (
    <div
      ref={noteRef}
      onMouseDown={onDrag}
      className={styles.note}
      style={{ left: position.x, top: position.y }}
    >
      {note.content}
    </div>
  )
}
