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

const IGOR_COLORS = ['#f5cb5c', '#7fc8f8', '#d2a8ff', '#a1e887']

export default function QueryBubble({ bubble, onDelete }: { bubble: Bubble, onDelete: (id: string) => void }) {
  const bubbleRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: bubble.x_position, y: bubble.y_position })
  const [dimensions, setDimensions] = useState({ width: bubble.width || 140, height: bubble.height || 140 })
  const [selected, setSelected] = useState(false)
  const [currentColor, setCurrentColor] = useState(bubble.color?.trim() || IGOR_COLORS[0])

  useEffect(() => {
    setPosition({ x: bubble.x_position, y: bubble.y_position })
  }, [bubble.x_position, bubble.y_position])

  const onDrag = (e: React.MouseEvent) => {
    if (!selected) return
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

      await supabase.from('dashboard_queries').update({
        x_position: position.x,
        y_position: position.y
      }).eq('id', bubble.id)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  const onResize = (e: React.MouseEvent) => {
    e.stopPropagation()
    const startX = e.clientX
    const startY = e.clientY
    const origW = dimensions.width
    const origH = dimensions.height

    const onMouseMove = (moveEvent: MouseEvent) => {
      const dw = moveEvent.clientX - startX
      const dh = moveEvent.clientY - startY
      setDimensions({
        width: Math.max(100, origW + dw),
        height: Math.max(100, origH + dh),
      })
    }

    const onMouseUp = async () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)

      await supabase.from('dashboard_queries').update({
        width: dimensions.width,
        height: dimensions.height,
      }).eq('id', bubble.id)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  const handleColorChange = async (newColor: string) => {
    setCurrentColor(newColor)
    await supabase.from('dashboard_queries').update({ color: newColor }).eq('id', bubble.id)
  }

  return (
    <div
      ref={bubbleRef}
      onMouseDown={onDrag}
      className={`${styles.bubble} ${selected ? styles.selected : ''}`}
      style={{
        left: position.x,
        top: position.y,
        width: dimensions.width,
        height: dimensions.height,
        backgroundColor: currentColor,
        zIndex: selected ? 100 : 1,
      }}
      onClick={(e) => {
        e.stopPropagation()
        setSelected(true)
      }}
    >
      {selected && (
        <>
          <button className={styles['close-button']} onClick={() => onDelete(bubble.id)}>×</button>
          <div className={styles.colorPicker}>
            {IGOR_COLORS.map((c) => (
              <div
                key={c}
                className={styles.colorOption}
                style={{ backgroundColor: c, border: c === currentColor ? '2px solid white' : 'none' }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleColorChange(c)
                }}
              />
            ))}
          </div>
          <div className={styles.resizer} onMouseDown={onResize} />
        </>
      )}
      <h3>{bubble.title}</h3>
      <p>{bubble.value}</p>
    </div>
  )
}
