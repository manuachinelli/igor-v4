'use client'

import { useRef, useState } from 'react'
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
          .update({
            x_position: position.x,
            y_position: position.y,
          })
          .eq('id', bubble.id)
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  return (
    <div
      ref={bubbleRef}
      onMouseDown={onDrag}
      className={`${styles.bubble} ${bubble.value === 'Cargando...' ? styles.loading : ''}`}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: 140,
        height: 140,
        backgroundColor: '#2c2c2c', // fijo para asegurar gris oscuro
      }}
    >
      <button className={styles['close-button']} onClick={() => onDelete(bubble.id)}>×</button>
      <h3>{bubble.title}</h3>
      <p>{bubble.value}</p>
    </div>
  )
}
