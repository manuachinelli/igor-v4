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
  activeId,
  setActiveId,
}: {
  bubble: Bubble
  onDelete: (id: string) => void
  activeId: string | null
  setActiveId: (id: string | null) => void
}) {
  const bubbleRef = useRef<HTMLDivElement>(null)

  const [position, setPosition] = useState({ x: bubble.x_position || 100, y: bubble.y_position || 100 })
  const [size, setSize] = useState({ width: bubble.width || 140, height: bubble.height || 140 })
  const isActive = activeId === bubble.id

  useEffect(() => {
    setPosition({ x: bubble.x_position || 100, y: bubble.y_position || 100 })
    setSize({ width: bubble.width || 140, height: bubble.height || 140 })
  }, [bubble])

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
        await supabase.from('dashboard_queries').update({
          x_position: position.x,
          y_position: position.y,
        }).eq('id', bubble.id)
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
      setSize({
        width: Math.max(100, origWidth + dx),
        height: Math.max(100, origHeight + dy),
      })
    }

    const onMouseUp = async () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      if (!bubble.id.startsWith('temp-')) {
        await supabase.from('dashboard_queries').update({
          width: size.width,
          height: size.height,
        }).eq('id', bubble.id)
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  return (
    <div
      ref={bubbleRef}
      onMouseDown={(e) => {
        onDrag(e)
        setActiveId(bubble.id)
      }}
      className={`${styles.bubble} ${isActive ? styles.active : ''} ${bubble.value === 'Cargando...' ? styles.loading : ''}`}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        backgroundColor: bubble.color?.trim().toLowerCase() === '#ffffff' ? '#2c2c2c' : bubble.color?.trim() || '#2c2c2c',
      }}
    >
      {isActive && (
        <>
          <button className={styles['close-button']} onClick={() => onDelete(bubble.id)}>×</button>
          <div className={styles.resizer} onMouseDown={onResize} />
        </>
      )}
      <h3>{bubble.title}</h3>
      <p>{bubble.value}</p>
    </div>
  )
}
