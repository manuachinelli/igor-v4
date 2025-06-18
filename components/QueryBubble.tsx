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

const IGOR_COLORS = ['#ffc700', '#4fc3f7', '#7b61ff', '#00c853']

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
        } else {
          console.log('✅ Posición guardada en Supabase:', position)
        }
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  const isColorValid = (color: string | null | undefined) =>
    color && IGOR_COLORS.includes(color.trim().toLowerCase())

  return (
    <div
      ref={bubbleRef}
      onMouseDown={onDrag}
      className={`${styles.bubble} ${bubble.value === 'Cargando...' ? styles.loading : ''}`}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        backgroundColor: isColorValid(bubble.color) ? bubble.color : '#f5f5f5',
      }}
    >
      <button className={styles['close-button']} onClick={() => onDelete(bubble.id)}>×</button>
      <h3>{bubble.title}</h3>
      <p>{bubble.value}</p>
    </div>
  )
}
