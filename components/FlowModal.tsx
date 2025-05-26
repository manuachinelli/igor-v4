'use client'

import { useState } from 'react'
import styles from './FlowModal.module.css'

type Flow = {
  name: string
  description: string
  platforms: string[]
  stats24h: number
  stats30d: number
}

type Props = {
  isOpen: boolean
  onClose: () => void
  flow: Flow
  onSave: (updatedFlow: Flow) => void
}

export default function FlowModal({ isOpen, onClose, flow, onSave }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(flow.name)
  const [description, setDescription] = useState(flow.description)

  if (!isOpen) return null

  const handleSave = () => {
    onSave({ ...flow, name, description })
    setIsEditing(false)
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          {isEditing ? (
            <input
              className={styles.inputTitle}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          ) : (
            <h2 className={styles.title}>
              {name}
              <span
                onClick={() => setIsEditing(true)}
                style={{ cursor: 'pointer', fontSize: 18, marginLeft: 8 }}
              >
                ✏️
              </span>
            </h2>
          )}
          <hr className={styles.separator} />
        </div>

        <div className={styles.platforms}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className={styles.circle} />
          ))}
        </div>

        <div className={styles.description}>
          {isEditing ? (
            <textarea
              className={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          ) : (
            <p>{description}</p>
          )}
        </div>

        <div className={styles.stats}>
          <div className={styles.statCircle}>
            <div className={styles.statNumber}>{flow.stats24h}</div>
            <div className={styles.statLabel}>Task en las últimas 24hs</div>
          </div>
          <div className={styles.statCircle}>
            <div className={styles.statNumber}>{flow.stats30d}</div>
            <div className={styles.statLabel}>Task en últimos 30 días</div>
          </div>
        </div>

        {isEditing && (
          <button className={styles.saveButton} onClick={handleSave}>
            Guardar
          </button>
        )}
      </div>
    </div>
  )
}
