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
  const [size, setSize] = useState({ width: bubble.width || 200, height: bubble.height || 120 })

  useEffect(() => {
    setPosition({ x: bubble.x_position, y: bubble.y_position })
  }, [bubble.x_position, bubble.y_position])

  const onDrag = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains(styles.resizeHandle)) return
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
      await supabase
        .from('dashboard_queries')
        .update({ x_position: position.x, y_position: position.y })
        .eq('id', bubble.id)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  const onResize = (e: React.MouseEvent) => {
    e.stopPropagation()
    const startX = e.clientX
    const startY = e.clientY
    const origWidth = size.width
    const origHeight = size.height

    const onMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX
      const dy = moveEvent.clientY - startY
      setSize({ width: Math.max(120, origWidth + dx), height: Math.max(80, origHeight + dy) })
    }

    const onMouseUp = async () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      await supabase
        .from('dashboard_queries')
        .update({ width: size.width, height: size.height })
        .eq('id', bubble.id)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  const handleColorChange = async (color: string) => {
    await supabase.from('dashboard_queries').update({ color }).eq('id', bubble.id)
    onUpdate(bubble.id, { color })
  }

  return (
    <div
      ref={bubbleRef}
      onMouseDown={onDrag}
      onClick={(e) => {
        e.stopPropagation()
        isSelected ? onDeselect() : onSelect(bubble.id)
      }}
      className={`${styles.bubble} ${bubble.value === 'Cargando...' ? styles.loading : ''}`}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        backgroundColor: bubble.color || '#2c2c2c',
        zIndex: isSelected ? 1000 : 1,
      }}
    >
      {isSelected && (
        <>
          <button className={styles.closeButton} onClick={() => onDelete(bubble.id)}>
            ×
          </button>
          <div className={styles.colorSelector}>
            {['#ffc700', '#7b61ff', '#6fe49c', '#76d5ff'].map((color) => (
              <span
                key={color}
                style={{
                  backgroundColor: color,
                  border: bubble.color === color ? '2px solid white' : '1px solid #888',
                }}
                onClick={() => handleColorChange(color)}
              />
            ))}
          </div>
        </>
      )}
      <h3>{bubble.title}</h3>
      <p>{bubble.value}</p>
      {isSelected && <div className={styles.resizeHandle} onMouseDown={onResize} />}
    </div>
  )
}
