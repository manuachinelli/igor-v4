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
  width: number | null
  height: number | null
  color: string
}

export default function QueryBubble({ bubble, onDelete }: { bubble: Bubble, onDelete: (id: string) => void }) {
  const bubbleRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: bubble.x_position, y: bubble.y_position })
  const [size, setSize] = useState({ width: bubble.width || 200, height: bubble.height || 140 })
  const [isSelected, setIsSelected] = useState(false)

  useEffect(() => {
    setPosition({ x: bubble.x_position, y: bubble.y_position })
    setSize({ width: bubble.width || 200, height: bubble.height || 140 })
  }, [bubble.x_position, bubble.y_position, bubble.width, bubble.height])

  const onDrag = (e: React.MouseEvent) => {
    if (!isSelected) return
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
          y_position: position.y
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
      const newWidth = Math.max(100, origWidth + (moveEvent.clientX - startX))
      const newHeight = Math.max(60, origHeight + (moveEvent.clientY - startY))
      setSize({ width: newWidth, height: newHeight })
    }

    const onMouseUp = async () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      await supabase.from('dashboard_queries').update({
        width: size.width,
        height: size.height
      }).eq('id', bubble.id)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  return (
    <div
      ref={bubbleRef}
      className={`${styles.bubble} ${isSelected ? styles.selected : ''}`}
      onMouseDown={onDrag}
      onClick={() => setIsSelected(true)}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        backgroundColor: bubble.color?.trim() || '#2c2c2c'
      }}
    >
      {isSelected && (
        <>
          <button className={styles.closeButton} onClick={() => onDelete(bubble.id)}>×</button>
          <div className={styles.resizeHandle} onMouseDown={onResize} />
        </>
      )}
      <h3>{bubble.title}</h3>
      <p>{bubble.value}</p>
    </div>
  )
}
