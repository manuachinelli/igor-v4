'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import styles from './QueryBubbleModern.module.css'
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

interface QueryBubbleProps {
  bubble: Bubble
  onDelete: (id: string) => void
  onUpdatePosition: (id: string, x: number, y: number) => void
}

export default function QueryBubble({ bubble, onDelete, onUpdatePosition }: QueryBubbleProps) {
  const bubbleRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: bubble.x_position || 100, y: bubble.y_position || 100 })
  const [size, setSize] = useState({ width: bubble.width || 250, height: bubble.height || 180 })
  const [isSelected, setIsSelected] = useState(false)

  useEffect(() => {
    setPosition({ x: bubble.x_position || 100, y: bubble.y_position || 100 })
    setSize({ width: bubble.width || 250, height: bubble.height || 180 })
  }, [bubble.x_position, bubble.y_position, bubble.width, bubble.height])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (bubbleRef.current && !bubbleRef.current.contains(e.target as Node)) {
        setIsSelected(false)
      }
    }
    window.addEventListener('click', handleClickOutside)
    return () => window.removeEventListener('click', handleClickOutside)
  }, [])

  // Para evitar múltiples updates muy seguidos, debounce simple
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)

  const onDrag = (e: React.MouseEvent) => {
    e.stopPropagation()
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
        const { error } = await supabase.from('dashboard_queries').update({
          x_position: position.x,
          y_position: position.y,
        }).eq('id', bubble.id)

        if (error) console.error('❌ Error al guardar posición:', error)

        // Uso debounce para llamar a onUpdatePosition sin saturar
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current)
        debounceTimeout.current = setTimeout(() => {
          onUpdatePosition(bubble.id, position.x, position.y)
        }, 100) // 100ms debounce
      }
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
      setSize({ width: Math.max(150, origWidth + dx), height: Math.max(150, origHeight + dy) })
    }

    const onMouseUp = async () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)

      if (!bubble.id.startsWith('temp-')) {
        const { error } = await supabase.from('dashboard_queries').update({
          width: size.width,
          height: size.height,
        }).eq('id', bubble.id)

        if (error) console.error('❌ Error al guardar tamaño:', error)
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  return (
    <div
      ref={bubbleRef}
      onClick={() => setIsSelected(true)}
      onMouseDown={onDrag}
      className={`${styles.card} ${isSelected ? styles.selected : ''}`}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
      }}
    >
      <div className={styles.header}>
        <div className={styles.icon} style={{ backgroundColor: bubble.color }}>
          {bubble.title[0].toUpperCase()}
        </div>
        <span className={styles.title}>{bubble.title}</span>
        {isSelected && (
          <button className={styles.close} onClick={() => onDelete(bubble.id)}>✕</button>
        )}
      </div>

      <div className={styles.subtitle}>Valor actual</div>
      <div className={styles.value}>{bubble.value}</div>

      {isSelected && (
        <div className={styles.resizer} onMouseDown={onResize} />
      )}
    </div>
  )
}
