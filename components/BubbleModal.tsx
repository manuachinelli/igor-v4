'use client'

import { useState } from 'react'
import styles from './BubbleModal.module.css'

type Props = {
  onCreate: (title: string, color: string) => void
  onCancel: () => void
}

const COLORS = [
  '#4CAF50', // verde
  '#FF9800', // naranja
  '#9C27B0', // violeta
  '#2196F3', // azul
  '#757575', // gris
]

export default function BubbleModal({ onCreate, onCancel }: Props) {
  const [title, setTitle] = useState('')
  const [selectedColor, setSelectedColor] = useState(COLORS[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onCreate(title.trim(), selectedColor)
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onCancel} aria-label="Cerrar">×</button>
        <h2 className={styles.header}>Nueva tarjeta</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label} htmlFor="bubble-title">Título</label>
          <input
            id="bubble-title"
            className={styles.input}
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Título de la tarjeta"
            autoFocus
          />
          <label className={styles.label}>Color</label>
          <div className={styles.colors}>
            {COLORS.map(color => (
              <button
                key={color}
                type="button"
                className={`${styles.colorBtn} ${selectedColor === color ? styles.selected : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
                aria-label={`Seleccionar color ${color}`}
              />
            ))}
          </div>
          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onCancel}>Cancelar</button>
            <button type="submit" className={styles.submitBtn}>Crear</button>
          </div>
        </form>
      </div>
    </div>
  )
}
