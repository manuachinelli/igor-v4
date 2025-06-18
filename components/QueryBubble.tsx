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

export default function QueryBubble({ bubble, onDelete }: { bubble: Bubble, onDelete: (id: string) => void }) {
  const bubbleRef = useRef<HTMLDivElement>(null)
  const [isSelected, setIsSelected] = useState(false)

  const [position, setPosition] = useState({
    x: bubble.x_position || 100,
    y: bubble.y_position || 100,
  })

  const [size, setSize] = useState({
    width: bubble.width || 180,
    height: bubble.height || 140,
  })

  useEffect(() => {
    setPosition({
      x: bubble.x_position || 100,
      y: bubble.y_position || 100,
    })
    setSize({
      width: bubble.width || 180,
      height: bubble.height || 140,
    })
  }, [bubble.x_position, bubble.y_position, bubble.width, bubble.height])

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

      if (!bubble.id.startsWith('temp-')) {
        await supabase
          .from('dashboard_queries')
          .update({ x_position: position.x, y_position: position.y })
          .eq('id', bubble.id)
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  const onResize = (e: React.MouseEvent) => {
    e.stopPropagation()
    const startX = e.clientX
    const startY = e.clientY
    const startWidth = size.width
    const startHeight = size.height

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(100, startWidth + (moveEvent.clientX - startX))
      const newHeight = Math.max(100, startHeight + (moveEvent.clientY - startY))
      setSize({ width: newWidth, height: newHeight })
    }

    const onMouseUp = async () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)

      if (!bubble.id.startsWith('temp-')) {
        await supabase
          .from('dashboard_queries')
          .update({ width: size.width, height: size.height })
          .eq('id', bubble.id)
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  const updateColor = async (newColor: string) => {
    if (!bubble.id.startsWith('temp-')) {
      await supabase
        .from('dashboard_queries')
        .update({ color: newColor })
        .eq('id', bubble.id)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bubbleRef.current && !bubbleRef.current.contains(event.target as Node)) {
        setIsSelected(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div
      ref={bubbleRef}
      onMouseDown={onDrag}
      onClick={(e) => {
        e.stopPropagation()
        setIsSelected(true)
      }}
      className={`${styles.bubble} ${bubble.value === 'Cargando...' ? styles.loading : ''}`}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        backgroundColor:
          bubble.color?.trim().toLowerCase() === '#ffffff'
            ? '#2c2c2c'
            : bubble.color?.trim() || '#2c2c2c',
      }}
    >
      {isSelected && (
        <div className={styles.colorPicker}>
          {['#ffc700', '#7b61ff', '#57d1c9', '#00c2ff'].map((color) => (
            <div
              key={color}
              className={`${styles.colorDot} ${bubble.color === color ? styles.active : ''}`}
              style={{ backgroundColor: color }}
              onClick={(e) => {
                e.stopPropagation()
                updateColor(color)
              }}
            />
          ))}
        </div>
      )}

      {isSelected && (
        <button className={styles['close-button']} onClick={() => onDelete(bubble.id)}>×</button>
      )}

      <h3>{bubble.title}</h3>
      <p>{bubble.value}</p>

      {isSelected && <div className={styles.resizeHandle} onMouseDown={onResize} />}
    </div>
  )
}
