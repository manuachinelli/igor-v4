'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './QueryBubble.module.css'

interface Bubble {
  id: string
  user_id: string
  query_text: string
  title: string
  value: string
  x_position: number
  y_position: number
  width: number
  height: number
  color: string
  is_editable: boolean
}

interface Props {
  bubble: Bubble
  onDelete: (id: string) => void
  isSelected: boolean
  onSelect: () => void
  onDeselect: () => void
  onUpdate: (id: string, data: Partial<Bubble>) => void
}

export default function QueryBubble({ bubble, onDelete, isSelected, onSelect, onDeselect, onUpdate }: Props) {
  const [position, setPosition] = useState({ x: bubble.x_position, y: bubble.y_position })
  const [size, setSize] = useState({ width: bubble.width, height: bubble.height })
  const [dragging, setDragging] = useState(false)
  const [resizing, setResizing] = useState(false)
  const bubbleRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains(styles.resizer)) return
    setDragging(true)
    onSelect()
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (dragging) {
      const newX = e.clientX - 100
      const newY = e.clientY - 100
      setPosition({ x: newX, y: newY })
    } else if (resizing) {
      const rect = bubbleRef.current?.getBoundingClientRect()
      if (!rect) return
      const newWidth = e.clientX - rect.left
      const newHeight = e.clientY - rect.top
      setSize({ width: newWidth, height: newHeight })
    }
  }

  const handleMouseUp = () => {
    if (dragging || resizing) {
      setDragging(false)
      setResizing(false)
      onUpdate(bubble.id, {
        x_position: position.x,
        y_position: position.y,
        width: size.width,
        height: size.height,
      })
    }
  }

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  })

  return (
    <div
      className={`${styles.bubble} ${isSelected ? styles.selected : ''}`}
      ref={bubbleRef}
      onMouseDown={handleMouseDown}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        backgroundColor: bubble.color,
        zIndex: isSelected ? 10 : 1,
      }}
    >
      <div className={styles.header}>
        <span>{bubble.title}</span>
        <button className={styles.delete} onClick={() => onDelete(bubble.id)}>×</button>
      </div>
      <div className={styles.content}>{bubble.query_text}</div>
      <div className={styles.value}>{bubble.value}</div>
      <div
        className={styles.resizer}
        onMouseDown={() => setResizing(true)}
      />
    </div>
  )
}
