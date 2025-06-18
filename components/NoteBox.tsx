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
  font_size?: number
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
  const [fontSize, setFontSize] = useState(note.font_size || 16)
  const [bold, setBold] = useState(false)

  const contentRef = useRef<HTMLDivElement>(null)
  const isSelected = selectedId === note.id

  useEffect(() => {
    setPosition({ x: note.x_position, y: note.y_position })
    setSize({ w: note.width, h: note.height })
    setContent(note.content)
    setFontSize(note.font_size || 16)
  }, [note])

  const handleBlur = async () => {
    await supabase.from('dashboard_notes').update({
      content,
      font_size: fontSize
    }).eq('id', note.id)
  }

  const handleDrag = (e: React.MouseEvent) => {
    if (!isSelected) return
    const startX = e.clientX
    const startY = e.clientY
    const origX = position.x
    const origY = position.y

    const onMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX
      const dy = moveEvent.clientY - startY
      const newX = origX + dx
      const newY = origY + dy
      setPosition({ x: newX, y: newY })
    }

    const onUp = async () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      await supabase.from('dashboard_notes').update({
        x_position: position.x,
        y_position: position.y
      }).eq('id', note.id)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  const handleResize = (e: React.MouseEvent) => {
    e.stopPropagation()
    const startX = e.clientX
    const startY = e.clientY
    const startW = size.w
    const startH = size.h

    const onMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX
      const dy = moveEvent.clientY - startY
      setSize({ w: startW + dx, h: startH + dy })
    }

    const onUp = async () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      await supabase.from('dashboard_notes').update({
        width: size.w,
        height: size.h
      }).eq('id', note.id)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  const handleChange = (e: React.FormEvent<HTMLDivElement>) => {
    const value = e.currentTarget.innerText
    setContent(value)
  }

  const changeFontSize = (delta: number) => {
    const newSize = Math.max(8, fontSize + delta)
    setFontSize(newSize)
    handleBlur()
  }

  const toggleBold = () => {
    setBold(!bold)
  }

  return (
    <div
      className={styles.note}
      style={{
        left: position.x,
        top: position.y,
        width: size.w,
        height: size.h,
        fontSize: `${fontSize}px`,
        fontWeight: bold ? 'bold' : 'normal',
        zIndex: isSelected ? 999 : 1,
      }}
      onClick={(e) => {
        e.stopPropagation()
        setSelectedId(note.id)
      }}
      onMouseDown={handleDrag}
    >
      {isSelected && (
        <>
          <button className={styles.closeButton} onClick={() => onDelete(note.id)}>×</button>
          <div className={styles.toolbar}>
            <button onClick={() => changeFontSize(2)}>＋</button>
            <button onClick={() => changeFontSize(-2)}>−</button>
            <button onClick={toggleBold}>B</button>
          </div>
        </>
      )}

      <div
        ref={contentRef}
        className={styles.contentEditable}
        contentEditable={isSelected}
        suppressContentEditableWarning
        onInput={handleChange}
        onBlur={handleBlur}
      >
        {content}
      </div>

      {isSelected && (
        <div className={styles.resizeHandle} onMouseDown={handleResize} />
      )}
    </div>
  )
}
