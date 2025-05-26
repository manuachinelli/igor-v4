'use client'

import { useState } from 'react'
import styles from './styles.module.css'
import Image from 'next/image'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

const flows = [
  { id: 1, name: 'Ordenes de pago a excel' },
  { id: 2, name: 'Seguimiento a clientes' },
  { id: 3, name: 'Stock x Whatsapp' },
  { id: 4, name: 'Nuevas oportunidades' },
  { id: 5, name: 'Ordenes de pago a excel' },
  { id: 6, name: 'Seguimiento a clientes' },
]

export default function FlowsPage() {
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState('')

  const openModal = (content: string) => {
    setModalContent(content)
    setShowModal(true)
  }

  return (
    <div className={`${styles.container} ${inter.className}`}>
      <Image src="/sidebar-icons/flows.png" alt="Flows Logo" width={80} height={80} className={styles.logo} />
      
      <div className={styles.grid}>
        {flows.map((flow) => (
          <button key={flow.id} className={styles.flowButton} onClick={() => openModal(flow.name)}>
            {flow.name}
          </button>
        ))}
      </div>

      <p className={styles.solicitarTexto}>Solicitar un nuevo flow</p>
      <button className={styles.addButton} onClick={() => openModal('Nuevo Flow')}>+</button>

      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>{modalContent}</h3>
            <p>Contenido por ahora en blanco.</p>
          </div>
        </div>
      )}
    </div>
  )
}
