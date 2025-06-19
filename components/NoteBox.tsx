'use client'

import { useRef, useState, useEffect } from 'react'
import styles from './NoteBox.module.css'
import { supabase } from '@/lib/supabaseClient'

interface Note {
  id: string
  user_id: string
  content: string
  x_position: number
  y_position: number
  font_family?: string
  font_size?: number
  font_color?: string
  font_bold?: boolean
  text_align?: 'left' | 'center' | 'right'
  background_color?: string
  is_locked?: boolean
}

interface NoteBoxProps {
  note: Note
  onDelete: (id: string) => void
  selectedId: string | null
  setSelectedId: (id: string | null) => void
}

const FONT_FAMILIES = [
  'Arial', 'Courier New', 'Georgia', 'Noto Sans', 'Times New Roman', 'Verdana'
]

export default function NoteBox({ note, onDelete, selectedId, setSelectedId }: NoteBoxProps) {
  const [position, setPosition] = useState({ x: note.x_position, y: note.y_position })
  const [fontFamily, setFontFamily] = useState(note.font_family || 'Noto Sans')
  const [fontSize, setFontSize] = useState(note.font_size || 16)
  const [fontColor, setFontColor] = useState(note.font_color || '#000000')
  const [backgroundColor, setBackgroundColor] = useState(note.background_color || 'transparent')
  const [bold, setBold] = useState(note.font_bold || false)
  const [textAlign, setTextAlign] = useState<Note['text_align']>(note.text_align || 'left')
  const [locked, setLocked] = useState(note.is_locked || false)
  const [isDragging, setIsDragging] = useState(false)

  const contentRef = useRef<HTMLDivElement>(null)
  const isSelected = selectedId === note.id

  useEffect(() => {
    setPosition({ x: note.x_position, y: note.y_position })
    setFontFamily(note.font_family || 'Noto Sans')
    setFontSize(note.font_size || 16)
    setFontColor(note.font_color || '#000000')
    setBackgroundColor(note.background_color || 'transparent')
    setBold(note.font_bold || false)
    setTextAlign(note.text_align || 'left')
    setLocked(note.is_locked || false)
    setTimeout(() => {
      if (contentRef.current) {
        contentRef.current.innerText = note.content
      }
    }, 0)
  }, [note])

  const updateNote = async () => {
    await supabase.from('dashboard_notes').update({
      content: contentRef.current?.innerText || '',
      font_family: fontFamily,
      font_size: fontSize,
      font_color: fontColor,
      background_color: backgroundColor,
      font_bold: bold,
      text_align: textAlign,
      is_locked: locked,
      x_position: position.x,
      y_position: position.y,
    }).eq('id', note.id)
  }

  const handleBlur = () => {
    updateNote()
  }

  const handleDrag = (e: React.MouseEvent) => {
    if (!isSelected || locked) return
    setIsDragging(true)
    const startX = e.clientX
    const startY = e.clientY
    const origX = position.x
    const origY = position.y

    const onMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX
      const dy = moveEvent.clientY - startY
      setPosition({ x: origX + dx, y: origY + dy })
    }

    const onUp = () => {
      setIsDragging(false)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      updateNote()
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  const handleResizeFont = (e: React.MouseEvent, corner: string) => {
    if (locked) return
    e.stopPropagation()
    const startX = e.clientX
    const startY = e.clientY
    const startFontSize = fontSize

    const onMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX
      const dy = moveEvent.clientY - startY
      let delta = 0
      if (corner === 'topLeft') delta = -(dx + dy) / 2
      else if (corner === 'topRight') delta = (dx - dy) / 2
      else if (corner === 'bottomLeft') delta = -(dx - dy) / 2
      else if (corner === 'bottomRight') delta = (dx + dy) / 2

      const newFontSize = Math.max(8, startFontSize + delta)
      setFontSize(newFontSize)
    }

    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      updateNote()
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  const changeFontSize = (delta: number) => {
    const newSize = Math.max(8, fontSize + delta)
    setFontSize(newSize)
    setTimeout(handleBlur, 0)
  }

  const toggleBold = () => { setBold(prev => !prev); setTimeout(handleBlur, 0) }
  const changeFontColor = (color: string) => { setFontColor(color); setTimeout(handleBlur, 0) }
  const changeBackgroundColor = (color: string) => { setBackgroundColor(color); setTimeout(handleBlur, 0) }
  const changeTextAlign = (align: Note['text_align']) => { setTextAlign(align); setTimeout(handleBlur, 0) }
  const changeFontFamily = (family: string) => { setFontFamily(family); setTimeout(handleBlur, 0) }
  const toggleLock = () => { setLocked(prev => !prev); setTimeout(handleBlur, 0) }

  return (
    <div
      className={`${styles.note} ${isSelected ? styles.selected : ''}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        fontSize: `${fontSize}px`,
        fontWeight: bold ? 'bold' : 'normal',
        color: fontColor,
        textAlign: textAlign,
        fontFamily: fontFamily,
        backgroundColor: backgroundColor,
        zIndex: isSelected ? 9999 : 1,
        userSelect: isDragging || locked ? 'none' : 'auto',
      }}
      onClick={e => { e.stopPropagation(); setSelectedId(note.id) }}
      onMouseDown={handleDrag}
    >
      {isSelected && !isDragging && (
        <div className={styles.toolbar} onMouseDown={e => e.stopPropagation()}>
          <select value={fontFamily} onChange={e => changeFontFamily(e.target.value)}>
            {FONT_FAMILIES.map(f => (<option key={f} value={f}>{f}</option>))}
          </select>
          <button onClick={() => changeFontSize(2)}>＋</button>
          <button onClick={() => changeFontSize(-2)}>−</button>
          <button onClick={toggleBold} className={bold ? styles.active : ''}>B</button>
          <input type="color" value={fontColor} onChange={e => changeFontColor(e.target.value)} />
          <input type="color" value={backgroundColor} onChange={e => changeBackgroundColor(e.target.value)} />
          <button onClick={() => changeTextAlign('left')}>L</button>
          <button onClick={() => changeTextAlign('center')}>C</button>
          <button onClick={() => changeTextAlign('right')}>R</button>
          <button onClick={toggleLock} className={locked ? styles.active : ''}>🔒</button>
          <button>⋮</button>
        </div>
      )}

      <div
        ref={contentRef}
        className={styles.contentEditable}
        contentEditable={isSelected && !locked}
        suppressContentEditableWarning
        onBlur={handleBlur}
      />

      {isSelected && !locked && (
        <>
          <div className={`${styles.fontResizeCircle} ${styles.topLeft}`} onMouseDown={(e) => handleResizeFont(e, 'topLeft')} />
          <div className={`${styles.fontResizeCircle} ${styles.topRight}`} onMouseDown={(e) => handleResizeFont(e, 'topRight')} />
          <div className={`${styles.fontResizeCircle} ${styles.bottomLeft}`} onMouseDown={(e) => handleResizeFont(e, 'bottomLeft')} />
          <div className={`${styles.fontResizeCircle} ${styles.bottomRight}`} onMouseDown={(e) => handleResizeFont(e, 'bottomRight')} />
        </>
      )}
    </div>
  )
}
