'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './IgorChat.module.css'
import { Note } from './IgorBubbles'
import { supabase } from '@/lib/supabaseClient'

type NoteBoxProps = {
  note: Note
  onDelete: (id: string) => Promise<void>
  onUpdate: (id: string, x: number, y: number) => void
}

export default function NoteBox({ note, onDelete, onUpdate }: NoteBoxProps) {
  const [position, setPosition] = useState({ x: note.x_position, y: note.y_position })
  const [isDragging, setIsDragging] = useState(false)
  const [content, setContent] = useState(note.content)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      const newX = e.clientX
      const newY = e.clientY
      setPosition({ x: newX, y: newY })
    }

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false)
        onUpdate(note.id, position.x, position.y)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, position, onUpdate, note.id])

  const handleContentChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    setContent(newText)
    await supabase.from('notes').update({ content: newText }).eq('id', note.id)
  }

  return (
    <div
      className={styles.note}
      style={{ left: position.x, top: position.y }}
      onMouseDown={() => setIsDragging(true)}
    >
      <textarea
        ref={textareaRef}
        className={styles.textarea}
        value={content}
        onChange={handleContentChange}
      />
      <button className={styles.closeButton} onClick={() => onDelete(note.id)}>
        ×
      </button>
    </div>
  )
}
