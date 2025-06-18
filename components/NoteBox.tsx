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
  width: number
  height: number
  font_size?: number
}

interface NoteBoxProps {
  note: Note
  onDelete: (id: string) => void
  selectedId: string | null
  setSelectedId: (id: string | null) => void
}

export default function NoteBox({ note, onDelete, selectedId, setSelectedId }: NoteBoxProps) {
  const [position, setPosition] = useState({ x: note.x_position, y: note.y_position })
  const [size, setSize] = useState({ w: note.width, h: note.height })
  const [htmlContent, setHtmlContent] = useState(note.content)
  const [fontSize, setFontSize] = useState(note.font_size || 16)
  const [showToolbar, setShowToolbar] = useState(false)
  const [toolbarPos, setToolbarPos] = useState({ x: 0, y: 0 })
  const contentRef = useRef<HTMLDivElement>(null)

  const isSelected = selectedId === note.id

  useEffect(() => {
    setPosition({ x: note.x_position, y: note.y_position })
    setSize({ w: note.width, h: note.height })
    setHtmlContent(note.content)
    setFontSize(note.font_size || 16)
  }, [note])

  const handleBlur = async () => {
    await supabase.from('dashboard_notes').update({
      content: contentRef.current?.innerHTML || '',
      font_size: fontSize
    }).eq('id', note.id)
  }

  const startDragging = (e: React.PointerEvent) => {
    e.stopPropagation()
    setSelectedId(note.id)
    const startX = e.clientX
    const startY = e.clientY
    const origX = position.x
    const origY = position.y

    const handleMove = async (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - startX
      const dy = moveEvent.clientY - startY
      const newX = origX + dx
      const newY = origY + dy
      setPosition({ x: newX, y: newY })

      await supabase.from('dashboard_notes').update({
        x_position: newX,
        y_position: newY
      }).eq('id', note.id)
    }

    const stopDragging = () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', stopDragging)
    }

    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', stopDragging)
  }

  const onResize = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedId(note.id)
    const startX = e.clientX
    const startY = e.clientY
    const startW = size.w
    const startH = size.h

    const onMouseMove = async (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX
      const dy = moveEvent.clientY - startY
      const newW = startW + dx
      const newH = startH + dy
      setSize({ w: newW, h: newH })

      await supabase.from('dashboard_notes').update({
        width: newW,
        height: newH
      }).eq('id', note.id)
    }

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  const applyStyle = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    handleBlur()
  }

  const handleMouseUp = () => {
    const sel = window.getSelection()
    if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
      const rect = sel.getRangeAt(0).getBoundingClientRect()
      setToolbarPos({ x: rect.left + rect.width / 2, y: rect.top - 40 })
      setShowToolbar(true)
    } else {
      setShowToolbar(false)
    }
  }

  const handleFontSizeChange = (delta: number) => {
    applyStyle('fontSize', '7') // usar tamaño grande temporal
    const selection = window.getSelection()
    if (!selection) return

    const span = document.createElement('span')
    span.style.fontSize = `${fontSize + delta}px`
    span.innerHTML = selection.toString()
    const range = selection.getRangeAt(0)
    range.deleteContents()
    range.insertNode(span)

    const updatedSize = fontSize + delta
    setFontSize(updatedSize)
    handleBlur()
  }

  return (
    <div
      className={styles.note}
      style={{
        left: position.x,
        top: position.y,
        width: size.w,
        height: size.h,
        zIndex: isSelected ? 999 : 1,
        fontSize: `${fontSize}px`
      }}
      onClick={(e) => {
        e.stopPropagation()
        setSelectedId(note.id)
      }}
      onPointerDown={startDragging}
    >
      {isSelected && (
        <button className={styles.closeButton} onClick={() => onDelete(note.id)}>×</button>
      )}

      <div
        ref={contentRef}
        className={styles.contentEditable}
        contentEditable
        suppressContentEditableWarning
        dangerouslySetInnerHTML={{ __html: htmlContent }}
        onBlur={handleBlur}
        onMouseUp={handleMouseUp}
      />

      {isSelected && (
        <div className={styles.resizeHandle} onMouseDown={onResize} />
      )}

      {showToolbar && (
        <div
          className={styles.toolbar}
          style={{ left: toolbarPos.x, top: toolbarPos.y }}
        >
          <button onClick={() => handleFontSizeChange(2)}>＋</button>
          <button onClick={() => handleFontSizeChange(-2)}>−</button>
          <button onClick={() => applyStyle('bold')}>B</button>
        </div>
      )}
    </div>
  )
}
