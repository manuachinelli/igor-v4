'use client'

import { useRef, useState, useEffect } from 'react'
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
  selectedId: string | null
  setSelectedId: (id: string | null) => void
}

export default function NoteBox({ note, onDelete, selectedId, setSelectedId }: NoteBoxProps) {
  const [position, setPosition] = useState({ x: note.x_position, y: note.y_position })
  const [size, setSize] = useState({ w: note.width, h: note.height })
  const [content, setContent] = useState(note.content)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isSelected = selectedId === note.id

  useEffect(() => {
    setPosition({ x: note.x_position, y: note.y_position })
    setSize({ w: note.width, h: note.height })
    setContent(note.content)
  }, [note])

  const handleBlur = async () => {
    await supabase.from('dashboard_notes').update({
      content: content
    }).eq('id', note.id)
  }

  const startDragging = (e: React.PointerEvent) => {
    e.stopPropagation()
    setSelectedId(note.id)
    const startX = e.clientX
    const startY = e.clientY
    const origX = position.x
    const origY = position.y

    const handleMove = async (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - startX
      const dy = moveEvent.clientY - startY
      const newX = origX + dx
      const newY = origY + dy
      setPosition({ x: newX, y: newY })

      await supabase.from('dashboard_notes').update({
        x_position: newX,
        y_position: newY
      }).eq('id', note.id)
    }

    const stopDragging = () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', stopDragging)
    }

    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', stopDragging)
  }

  const onResize = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedId(note.id)
    const startX = e.clientX
    const startY = e.clientY
    const startW = size.w
    const startH = size.h

    const onMouseMove = async (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX
      const dy = moveEvent.clientY - startY
      const newW = startW + dx
      const newH = startH + dy
      setSize({ w: newW, h: newH })

      await supabase.from('dashboard_notes').update({
        width: newW,
        height: newH
      }).eq('id', note.id)
    }

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  return (
    <div
      className={styles.note}
      style={{
        left: position.x,
        top: position.y,
        width: size.w,
        height: size.h,
        zIndex: isSelected ? 999 : 1
      }}
      onClick={(e) => {
        e.stopPropagation()
        setSelectedId(note.id)
      }}
      onPointerDown={startDragging}
    >
      {isSelected && (
        <button className={styles.closeButton} onClick={() => onDelete(note.id)}>×</button>
      )}
      <textarea
        ref={textareaRef}
        className={styles.textarea}
        value={content}
        onChange={e => setContent(e.target.value)}
        onBlur={handleBlur}
      />
      {isSelected && <div className={styles.resizeHandle} onMouseDown={onResize} />}
    </div>
  )
}
