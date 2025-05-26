'use client'

import { useState } from 'react'
import styles from './styles.module.css'

const mockCredentials = [
  'Zendesk', 'Slack', 'Notion', 'Airtable', 'Google', 'Hubspot', 'Discord',
  'Monday', 'Trello', 'Stripe', 'Intercom', 'Meta', 'WhatsApp', 'Asana',
]

export default function KeysPage() {
  const [showModal, setShowModal] = useState(false)
  const [selectedCredential, setSelectedCredential] = useState<string | null>(null)

  const handleOpenModal = (credential: string | null) => {
    setSelectedCredential(credential)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedCredential(null)
  }

  return (
    <div className={styles.container}>
      <button className={styles.addButton} onClick={() => handleOpenModal(null)}>
        +
        <span className={styles.addText}>Add credentials</span>
      </button>

      <div className={styles.grid}>
        {mockCredentials.map((name, index) => (
          <div
            key={index}
            className={styles.credentialBubble}
            onClick={() => handleOpenModal(name)}
          >
            {name[0]}
          </div>
        ))}
      </div>

      <div className={styles.lockContainer}>
        <img src="/sidebar-icons/lock-yellow.png" alt="lock" className={styles.lockIcon} />
        <p className={styles.lockText}>Todas las keys están encriptadas by Igor</p>
      </div>

      {showModal && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>{selectedCredential ? `Edit ${selectedCredential}` : 'Add Credential'}</h2>
            {/* Acá va el contenido dinámico del popup más adelante */}
            <p style={{ color: '#999', fontSize: 14 }}>Contenido en blanco por ahora</p>
            <button onClick={handleCloseModal} className={styles.closeButton}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  )
}
