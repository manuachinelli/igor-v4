'use client'

import { useRef, useState, useEffect } from 'react'
import styles from './QueryBubble.module.css'
import { supabase } from '@/lib/supabaseClient'

interface Bubble {
  id: string
  title: string
  value: string
  x_position: number
  y_position: number
  width: number
  height: number
  color: string
}

export default function QueryBubble({
  bubble,
  onDelete,
  isSelected,
  onSelect,
  onDeselect,
  onUpdate,
}: {
  bubble: Bubble
  onDelete: (id: string) => void
  isSelected: boolean
  onSelect: (id: string) => void
  onDeselect: () => void
  onUpdate: (id: string, data: Partial<Bubble>) => void
}) {
  const bubbleRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: bubble.x_position, y: bubble.y_position })
  const [dimensions, setDimensions] = useState({ width: bubble.width, height: bubble.height })

  // Deselect on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bubbleRef.current && !bubbleRef.current.contains(event.target as Node)) {
        onDeselect()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onDeselect])

  const startDrag = (e: React.MouseEvent) => {
    onSelect(bubble.id)
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
      onUpdate(bubble.id, { x_position: position.x, y_position: position.y })
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  const startResize = (e: React.MouseEvent) => {
    e.stopPropagation()
    const startX = e.clientX
    const startY = e.clientY
    const startWidth = dimensions.width
    const startHeight = dimensions.height

    const onMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX
      const dy = moveEvent.clientY - startY
      const newWidth = Math.max(100, startWidth + dx)
      const newHeight = Math.max(100, startHeight + dy)
      setDimensions({ width: newWidth, height: newHeight })
    }

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      onUpdate(bubble.id, { width: dimensions.width, height: dimensions.height })
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  const handleColorChange = (color: string) => {
    onUpdate(bubble.id, { color })
  }

  return (
    <div
      ref={bubbleRef}
      onMouseDown={startDrag}
      className={styles.bubble}
      style={{
        left: position.x,
        top: position.y,
        width: dimensions.width,
        height: dimensions.height,
        backgroundColor: bubble.color,
        border: isSelected ? '2px solid #ffffff66' : '1px solid #ffffff11',
      }}
    >
      {isSelected && (
        <>
          <button className={styles.closeButton} onClick={() => onDelete(bubble.id)}>×</button>
          <div className={styles.resizeHandle} onMouseDown={startResize} />
          <div className={styles.colorPicker}>
            {['#ffc700', '#0ea5e9', '#a855f7', '#22c55e'].map((color) => (
              <button
                key={color}
                style={{ backgroundColor: color }}
                className={styles.colorDot}
                onClick={(e) => {
                  e.stopPropagation()
                  handleColorChange(color)
                }}
              />
            ))}
          </div>
        </>
      )}
      <h3>{bubble.title}</h3>
      <p>{bubble.value}</p>
    </div>
  )
}
