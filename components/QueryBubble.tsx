'use client'

import { useState, useRef, useEffect } from 'react'
import styles from './QueryBubble.module.css'

type Bubble = {
  id: string
  title: string
  value: string
  x_position: number
  y_position: number
  width: number
  height: number
  color: string
}

type Props = {
  bubble: Bubble
  onDelete: (id: string) => void
  isSelected: boolean
  onSelect: (id: string) => void
  onDeselect: () => void
  onUpdate: (id: string, data: Partial<Bubble>) => void
}

export default function QueryBubble({
  bubble,
  onDelete,
  isSelected,
  onSelect,
  onDeselect,
  onUpdate
}: Props) {
  const [position, setPosition] = useState({ x: bubble.x_position, y: bubble.y_position })
  const [size, setSize] = useState({ width: bubble.width, height: bubble.height })
  const [content, setContent] = useState(bubble.value)
  const [color, setColor] = useState(bubble.color || '#FDE047')
  const bubbleRef = useRef<HTMLDivElement>(null)

  const colors = ['#FDE047', '#38BDF8', '#A78BFA', '#4ADE80']

  useEffect(() => {
    onUpdate(bubble.id, {
      x_position: position.x,
      y_position: position.y,
      width: size.width,
      height: size.height,
      value: content,
      color
    })
  }, [position, size, content, color])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (bubbleRef.current && !bubbleRef.current.contains(e.target as Node)) {
        onDeselect()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const startX = e.clientX
    const startY = e.clientY
    const initX = position.x
    const initY = position.y

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: initX + e.clientX - startX,
        y: initY + e.clientY - startY
      })
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleResize = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    const startX = e.clientX
    const startY = e.clientY
    const initW = size.width
    const initH = size.height

    const handleMouseMove = (e: MouseEvent) => {
      setSize({
        width: Math.max(100, initW + e.clientX - startX),
        height: Math.max(60, initH + e.clientY - startY)
      })
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  return (
    <div
      ref={bubbleRef}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(bubble.id)
      }}
      className={styles.bubble}
      style={{
        top: position.y,
        left: position.x,
        width: size.width,
        height: size.height,
        backgroundColor: color,
        border: isSelected ? '2px solid #000' : 'none',
        zIndex: isSelected ? 2 : 1
      }}
    >
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className={styles.textarea}
        placeholder="Escribí algo..."
      />
      {isSelected && (
        <>
          <div className={styles.resizeHandle} onMouseDown={handleResize} />
          <button className={styles.closeButton} onClick={() => onDelete(bubble.id)}>
            ×
          </button>
          <div className={styles.colorPicker}>
            {colors.map((c) => (
              <div
                key={c}
                className={styles.colorDot}
                style={{
                  backgroundColor: c,
                  border: c === color ? '2px solid #000' : 'none'
                }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
