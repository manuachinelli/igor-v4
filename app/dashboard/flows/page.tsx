'use client'

import { useState } from 'react'
import styles from './styles.module.css'
import Image from 'next/image'
import FlowModal from '@/components/FlowModal'

const flowsData = [
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
  {
    id: 3,
    name: 'Stock x Whatsapp',
    description: 'Envía stock actualizado a clientes por WhatsApp.',
    platforms: ['whatsapp'],
    stats24h: 20,
    stats30d: 105
  },
  {
    id: 4,
    name: 'Nuevas oportunidades',
    description: 'Crea oportunidades automáticamente desde formularios.',
    platforms: ['crm'],
    stats24h: 18,
    stats30d: 83
  },
  {
    id: 5,
    name: 'Recordatorio de pagos',
    description: 'Envía alertas de vencimientos por mail.',
    platforms: ['email'],
    stats24h: 7,
    stats30d: 49
  },
  {
    id: 6,
    name: 'Feedback post compra',
    description: 'Pide feedback después de cada venta.',
    platforms: ['email'],
    stats24h: 4,
    stats30d: 21
  }
]

export default function FlowsPage() {
  const [flows, setFlows] = useState(flowsData)
  const [selectedFlow, setSelectedFlow] = useState<any>(null)

  const handleOpenFlow = (flow: any) => {
    setSelectedFlow(flow)
  }

  const handleCloseModal = () => {
    setSelectedFlow(null)
  }

  const handleSaveFlow = (updatedFlow: any) => {
    setFlows((prev) =>
      prev.map((f) => (f.id === updatedFlow.id ? updatedFlow : f))
    )
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
      <button
        className={styles.addButton}
        onClick={() =>
          handleOpenFlow({
            id: null,
            name: 'Nuevo Flow',
            description: '',
            platforms: [],
            stats24h: 0,
            stats30d: 0
          })
        }
      >
        +
      </button>

      {selectedFlow && (
        <FlowModal
          isOpen={true}
          onClose={handleCloseModal}
          flow={selectedFlow}
          onSave={handleSaveFlow}
        />
      )}
    </div>
  )
}
