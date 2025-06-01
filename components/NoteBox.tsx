'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './NoteBox.module.css'
import { supabase } from '@/lib/supabaseClient'

interface Note {
  id: string
  content: string
  x_position: number
  y_position: number
  width: number
  height: number
}

interface NoteBoxProps {
  note: Note
  onDelete: (id: string) => void
  onUpdate: (id: string, x: number, y: number) => void
}

export default function NoteBox({ note, onDelete, onUpdate }: NoteBoxProps) {
  const [position, setPosition] = useState({ x: note.x_position, y: note.y_position })
  const [size, setSize] = useState({ w: note.width, h: note.height })
  const [content, setContent] = useState(note.content)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Drag
  const onDrag = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === 'TEXTAREA') return

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

      onUpdate(note.id, position.x, position.y)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  // Resize
  const onResize = (e: React.MouseEvent) => {
    e.stopPropagation()
    const startX = e.clientX
    const startY = e.clientY
    const startW = size.w
    const startH = size.h

    const onMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX
      const dy = moveEvent.clientY - startY
      setSize({ w: startW + dx, h: startH + dy })
    }

    const onMouseUp = async () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)

      await supabase.from('dashboard_notes').update({
        width: size.w,
        height: size.h
      }).eq('id', note.id)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  // Guardar contenido cuando se pierde foco
  const handleBlur = async () => {
    await supabase.from('dashboard_notes').update({
      content: content
    }).eq('id', note.id)
  }

  return (
    <div
      className={styles.note}
      style={{ left: position.x, top: position.y, width: size.w, height: size.h }}
      onMouseDown={onDrag}
    >
      <button className={styles.closeButton} onClick={() => onDelete(note.id)}>×</button>
      <textarea
        ref={textareaRef}
        className={styles.textarea}
        value={content}
        onChange={e => setContent(e.target.value)}
        onBlur={handleBlur}
      />
      <div className={styles.resizeHandle} onMouseDown={onResize} />
    </div>
  )
}
