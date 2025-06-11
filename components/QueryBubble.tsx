'use client'

import { useRef } from 'react'
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

  const onDrag = (e: React.MouseEvent) => {
    const startX = e.clientX
    const startY = e.clientY
    const origX = bubble.x_position || 100
    const origY = bubble.y_position || 100

    const onMouseMove = async (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX
      const dy = moveEvent.clientY - startY
      const newX = origX + dx
      const newY = origY + dy

      if (!bubble.id.startsWith('temp-')) {
        const { error } = await supabase
          .from('dashboard_queries')
          .update({
            x_position: newX,
            y_position: newY,
          })
          .eq('id', bubble.id)

        if (error) {
          console.error('❌ Error al guardar posición:', error)
        } else {
          console.log('✅ Posición guardada en Supabase:', { x: newX, y: newY })
        }
      }

      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
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
        left: bubble.x_position || 100,
        top: bubble.y_position || 100,
        width: 140,
        height: 140,
        backgroundColor:
          bubble.color?.trim().toLowerCase() === '#ffffff'
            ? '#2c2c2c'
            : bubble.color?.trim() || '#2c2c2c',
      }}
    >
      <button className={styles['close-button']} onClick={() => onDelete(bubble.id)}>×</button>
      <h3>{bubble.title}</h3>
      <p>{bubble.value}</p>
    </div>
  )
}
