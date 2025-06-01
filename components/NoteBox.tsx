'use client'

import { useRef, useState } from 'react'
import styles from './NoteBox.module.css'

interface NoteBoxProps {
  note: {
    id: string
    content: string
    x_position: number
    y_position: number
    width: number
    height: number
  }
  onDelete: (id: string) => void
  onUpdate: (id: string, updates: Partial<NoteBoxProps['note']>) => void
}

export default function NoteBox({ note, onDelete, onUpdate }: NoteBoxProps) {
  const [position, setPosition] = useState({ x: note.x_position, y: note.y_position })
  const [size, setSize] = useState({ w: note.width, h: note.height })
  const [content, setContent] = useState(note.content)

  const noteRef = useRef<HTMLDivElement>(null)

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
      onUpdate(note.id, { x_position: position.x, y_position: position.y })
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  const onResize = (e: React.MouseEvent) => {
    e.stopPropagation()
    const startX = e.clientX
    const startY = e.clientY
    const startWidth = size.w
    const startHeight = size.h

    const onMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX
      const dy = moveEvent.clientY - startY
      setSize({ w: Math.max(100, startWidth + dx), h: Math.max(50, startHeight + dy) })
    }

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      onUpdate(note.id, { width: size.w, height: size.h })
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  return (
    <div
      ref={noteRef}
      className={styles.note}
      style={{
        left: position.x,
        top: position.y,
        width: size.w,
        height: size.h
      }}
      onMouseDown={onDrag}
    >
      <button className={styles.closeButton} onClick={() => onDelete(note.id)}>×</button>
      <textarea
        className={styles.textarea}
        value={content}
        onChange={(e) => {
          setContent(e.target.value)
          onUpdate(note.id, { content: e.target.value })
        }}
      />
      <div className={styles.resizeHandle} onMouseDown={onResize} />
    </div>
  )
}
