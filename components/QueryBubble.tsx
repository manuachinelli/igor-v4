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
  const [position, setPosition] = useState({
    x: bubble.x_position || 100,
    y: bubble.y_position || 100,
  })

  useEffect(() => {
    setPosition({
      x: bubble.x_position || 100,
      y: bubble.y_position || 100,
    })
  }, [bubble.x_position, bubble.y_position])

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
        const { error } = await supabase
          .from('dashboard_queries')
          .update({
            x_position: position.x,
            y_position: position.y,
          })
          .eq('id', bubble.id)

        if (error) {
          console.error('❌ Error al guardar posición:', error)
        }
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  const backgroundColor = bubble.color?.trim() || '#fefefe'

  return (
    <div
      ref={bubbleRef}
      onMouseDown={onDrag}
      className={`${styles.bubble} ${bubble.value === 'Cargando...' ? styles.loading : ''}`}
      style={{
        left: position.x,
        top: position.y,
        width: 160,
        height: 160,
        backgroundColor,
      }}
    >
      <button className={styles['close-button']} onClick={() => onDelete(bubble.id)}>×</button>
      <h3>{bubble.title}</h3>
      <p>{bubble.value}</p>

      {/* esquina doblada */}
      <div
        className={styles.cornerFold}
        style={{
          backgroundColor: backgroundColor,
        }}
      />
    </div>
  )
}
