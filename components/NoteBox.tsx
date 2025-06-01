'use client'

import { useRef, useState } from 'react'
import styles from './NoteBox.module.css'
import { supabase } from '@/lib/supabaseClient'

interface Note {
  id: string
  user_id: string
  content: string
  x_position: number
  y_position: number
  width: number
  height: number
}

interface NoteBoxProps {
  note: Note
  onDelete: (id: string) => void
}

export default function NoteBox({ note, onDelete }: NoteBoxProps) {
  const [position, setPosition] = useState({ x: note.x_position, y: note.y_position })
  const [size, setSize] = useState({ w: note.width, h: note.height })
  const [content, setContent] = useState(note.content)
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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

  const handleBlur = async () => {
    setIsFocused(false)
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
      {isFocused && (
        <>
          <button className={styles.closeButton} onClick={() => onDelete(note.id)}>×</button>
          <div className={styles.resizeHandle} onMouseDown={onResize} />
        </>
      )}
      <textarea
        ref={textareaRef}
        className={styles.textarea}
        value={content}
        onChange={e => setContent(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
      />
    </div>
  )
}
