'use client'

import { useState } from 'react'
import styles from './styles.module.css'
import Image from 'next/image'
import FlowModal from '@/components/FlowModal'

const flows = [
  {
    id: 1,
    name: 'Ordenes de pago a excel',
    description: 'Cada vez que ingrese a manu@igor.ai un mail con un pdf adjunto, Igor se encarga de tomar ese PDF, extraer los datos, cargarlos en Excel y darle una respuesta al cliente agradeciendo por la información. A su vez, lo deja registrado en Igor AI',
    platforms: ['email', 'excel'],
    stats24h: 35,
    stats30d: 150
  },
  {
    id: 2,
    name: 'Seguimiento a clientes',
    description: 'Igor contacta automáticamente a clientes inactivos hace más de 30 días y ofrece ayuda o promociones para reactivarlos.',
    platforms: ['crm', 'email'],
    stats24h: 12,
    stats30d: 90
  },
  // Agregá más si querés
]

export default function FlowsPage() {
  const [selectedFlow, setSelectedFlow] = useState(null)

  const handleOpenFlow = (flow: any) => {
    setSelectedFlow(flow)
  }

  const handleCloseModal = () => {
    setSelectedFlow(null)
  }

  const handleSaveFlow = (updatedFlow: any) => {
    console.log('Flow guardado:', updatedFlow)
    setSelectedFlow(updatedFlow)
  }

  return (
    <div className={styles.container}>
      <Image src="/sidebar-icons/flows.png" alt="Flows Logo" width={80} height={80} className={styles.logo} />

      <div className={styles.grid}>
        {flows.map((flow) => (
          <button
            key={flow.id}
            className={styles.flowButton}
            onClick={() => handleOpenFlow(flow)}
          >
            {flow.name}
          </button>
        ))}
      </div>

      <p className={styles.solicitarTexto}>Solicitar un nuevo flow</p>
      <button className={styles.addButton} onClick={() => handleOpenFlow({
        id: null,
        name: 'Nuevo Flow',
        description: '',
        platforms: [],
        stats24h: 0,
        stats30d: 0
      })}>+</button>

      <FlowModal
        isOpen={!!selectedFlow}
        onClose={handleCloseModal}
        flow={selectedFlow || {}}
        onSave={handleSaveFlow}
      />
    </div>
  )
}
