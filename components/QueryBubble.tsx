'use client'

import { useState, useRef, useEffect } from 'react'
import styles from './QueryBubble.module.css'

export type Bubble = {
  id: string
  user_id: string
  title: string
  value: string
  x_position: number
  y_position: number
  color: string
}

type Props = {
  bubble: Bubble
  isSelected: boolean
  onSelect: (id: string) => void
  onDeselect: () => void
  onUpdate: (id: string, updates: Partial<Bubble>) => void
  onDelete: (id: string) => Promise<void>
}

const igorColors = ['#F9E27F', '#A5E3F4', '#D9A5F4', '#A5F4C4']

export default function QueryBubble({
  bubble,
  isSelected,
  onSelect,
  onDeselect,
  onUpdate,
  onDelete
}: Props) {
  const [editing, setEditing] = useState(false)
  const [content, setContent] = useState(bubble.value)
  const [position, setPosition] = useState({ x: bubble.x_position, y: bubble.y_position })
  const [size, setSize] = useState({ width: 200, height: 100 })
  const [color, setColor] = useState(bubble.color || igorColors[0])
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onDeselect()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [ref, onDeselect])

  const handleDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    const newX = position.x + e.movementX
    const newY = position.y + e.movementY
    setPosition({ x: newX, y: newY })
    onUpdate(bubble.id, { x_position: newX, y_position: newY })
  }

  const handleResize = (e: React.MouseEvent<HTMLDivElement>) => {
    const newWidth = size.width + e.movementX
    const newHeight = size.height + e.movementY
    setSize({ width: newWidth, height: newHeight })
  }

  const handleBlur = () => {
    setEditing(false)
    onUpdate(bubble.id, { value: content })
  }

  return (
    <div
      ref={ref}
      className={styles.bubble}
      onMouseDown={() => onSelect(bubble.id)}
      onDoubleClick={() => setEditing(true)}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        backgroundColor: color,
        zIndex: isSelected ? 10 : 1
      }}
    >
      {editing ? (
        <textarea
          value={content}
          autoFocus
          onChange={(e) => setContent(e.target.value)}
          onBlur={handleBlur}
          className={styles.textarea}
        />
      ) : (
        <div className={styles.content}>{content}</div>
      )}

      {isSelected && (
        <>
          <div className={styles.resizeHandle} onMouseDown={(e) => e.stopPropagation()} onMouseUp={(e) => e.preventDefault()} onMouseMove={handleResize} />
          <button className={styles.closeButton} onClick={() => onDelete(bubble.id)}>×</button>
          <div className={styles.colorPicker}>
            {igorColors.map((c) => (
              <div
                key={c}
                className={styles.colorDot}
                style={{ backgroundColor: c, border: c === color ? '2px solid black' : 'none' }}
                onClick={() => {
                  setColor(c)
                  onUpdate(bubble.id, { color: c })
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
