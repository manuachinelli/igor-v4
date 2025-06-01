'use client'

import { useRef, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import styles from './NoteBox.module.css'

interface Note {
  id: string
  content: string
  x_position: number
  y_position: number
  width: number
  height: number
}

export default function NoteBox({ note, onDelete }: { note: Note, onDelete: (id: string) => void }) {
  const noteRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: note.x_position, y: note.y_position })
  const [content, setContent] = useState(note.content)

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

    const onMouseUp = async () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)

      await supabase.from('dashboard_notes').update({
        x_position: position.x,
        y_position: position.y
      }).eq('id', note.id)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  const onBlur = async () => {
    await supabase.from('dashboard_notes').update({ content }).eq('id', note.id)
  }

  return (
    <div
      ref={noteRef}
      onMouseDown={onDrag}
      className={styles.noteBox}
      style={{
        left: position.x,
        top: position.y
      }}
    >
      <textarea
        className={styles.textarea}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onBlur={onBlur}
      />
      <button className={styles.closeButton} onClick={() => onDelete(note.id)}>×</button>
    </div>
  )
}
