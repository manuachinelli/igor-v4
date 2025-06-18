'use client'

import { useRef, useState, useEffect } from 'react'
import styles from './QueryBubble.module.css'
import { supabase } from '@/lib/supabaseClient'

interface Bubble {
  id: string
  user_id: string
  query_text: string
  title: string
  value: string
  x_position: number
  y_position: number
  width: number
  height: number
  color: string
  is_editable: boolean
}

const igorColors = ['#F9E27F', '#A5E3F4', '#D9A5F4', '#A5F4C4']

export default function QueryBubble({ bubble, onDelete }: { bubble: Bubble; onDelete: (id: string) => void }) {
  const [position, setPosition] = useState({ x: bubble.x_position, y: bubble.y_position })
  const [size, setSize] = useState({ width: bubble.width, height: bubble.height })
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(bubble.value)
  const [selected, setSelected] = useState(false)
  const [color, setColor] = useState(bubble.color || igorColors[0])
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setSelected(false)
        setEditing(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const updateBubble = async (updates: Partial<Bubble>) => {
    await supabase.from('dashboard_queries').update(updates).eq('id', bubble.id)
  }

  const handleDrag = (e: React.MouseEvent) => {
    if (!selected) return
    const newX = position.x + e.movementX
    const newY = position.y + e.movementY
    setPosition({ x: newX, y: newY })
    updateBubble({ x_position: newX, y_position: newY })
  }

  const handleResize = (e: React.MouseEvent) => {
    if (!selected) return
    const newWidth = size.width + e.movementX
    const newHeight = size.height + e.movementY
    setSize({ width: newWidth, height: newHeight })
    updateBubble({ width: newWidth, height: newHeight })
  }

  const handleBlur = () => {
    setEditing(false)
    updateBubble({ value: text })
  }

  const handleColorChange = (newColor: string) => {
    setColor(newColor)
    updateBubble({ color: newColor })
  }

  return (
    <div
      ref={ref}
      className={styles.bubble}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        backgroundColor: color,
        zIndex: selected ? 10 : 1,
      }}
      onMouseDown={() => setSelected(true)}
      onDoubleClick={() => setEditing(true)}
      onMouseMove={handleDrag}
    >
      {editing ? (
        <textarea
          className={styles.textarea}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          autoFocus
        />
      ) : (
        <div className={styles.text}>{text}</div>
      )}

      {selected && (
        <>
          <div className={styles.resizeHandle} onMouseDown={(e) => e.stopPropagation()} onMouseMove={handleResize} />
          <button className={styles.closeButton} onClick={() => onDelete(bubble.id)}>×</button>
          <div className={styles.colorPicker}>
            {igorColors.map((c) => (
              <div
                key={c}
                className={styles.colorDot}
                style={{ backgroundColor: c, border: c === color ? '2px solid black' : 'none' }}
                onClick={() => handleColorChange(c)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
