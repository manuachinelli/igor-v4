'use client'

import { useEffect, useState } from 'react'
import styles from './styles.module.css'
import Image from 'next/image'
import FlowModal from '@/components/FlowModal'
import NewFlowModal from '@/components/NewFlowModal'
import { supabase } from '@/lib/supabaseClient'

type Flow = {
  id: string
  user_id: string
  title: string
  state: string
  executions_count: number
  executions_success_count: number
  executions_error_count: number
}

export default function FlowsPage() {
  const [flows, setFlows] = useState<Flow[]>([])
  const [selectedFlow, setSelectedFlow] = useState<Flow | null>(null)
  const [showNewFlowModal, setShowNewFlowModal] = useState(false)

  const fetchFlows = async () => {
    const { data, error } = await supabase
      .from('dashboard_flows')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching flows:', error)
    } else {
      setFlows(data as Flow[])
    }
  }

  useEffect(() => {
    fetchFlows()
  }, [])

  const handleOpenFlow = (flow: Flow) => {
    setSelectedFlow(flow)
  }

  const handleCloseModal = () => {
    setSelectedFlow(null)
  }

  const handleOpenNewFlow = async () => {
    const { data, error } = await supabase.from('dashboard_flows').insert([
      {
        title: 'Nuevo Flow',
        state: 'requested',
      },
    ]).select()

    if (error) {
      console.error('Error creating new flow:', error)
      return
    }

    fetchFlows()
    setShowNewFlowModal(true)
  }

  const handleCloseNewFlowModal = () => {
    setShowNewFlowModal(false)
    fetchFlows()
  }

  const getStateLabel = (state: string) => {
    switch (state) {
      case 'active':
        return 'Activa'
      case 'error':
        return 'Activa con errores'
      case 'requested':
        return 'Solicitada'
      case 'review':
        return 'Revisión'
      default:
        return ''
    }
  }

  const getStateColor = (state: string) => {
    switch (state) {
      case 'active':
        return '#00FF7F' // verde
      case 'error':
        return '#FFD700' // amarillo
      case 'requested':
        return '#FF69B4' // rosa
      case 'review':
        return '#FF4500' // rojo
      default:
        return '#999999' // gris default
    }
  }

  return (
    <div className={styles.container}>
      {/* Botón + arriba derecha */}
      <div className={styles.addButtonContainer}>
        <button className={styles.addButton} onClick={handleOpenNewFlow}>
          +
        </button>
        <p className={styles.addButtonText}>Solicita un nuevo flow</p>
      </div>

      {/* Grid de flows */}
      <div className={styles.grid}>
        {flows.map((flow) => (
          <button
            key={flow.id}
            className={styles.flowButton}
            onClick={() => handleOpenFlow(flow)}
          >
            <div className={styles.flowTitle}>{flow.title}</div>
            <div className={styles.flowLine} /> {/* la línea blanca que pediste */}
            <div
              className={styles.statusDot}
              style={{ backgroundColor: getStateColor(flow.state) }}
            />
            <div className={styles.statusLabel}>{getStateLabel(flow.state)}</div>
          </button>
        ))}
      </div>

      {/* Logo abajo centro */}
      <Image
        src="/sidebar-icons/flows.png"
        alt="Flows Logo"
        width={80}
        height={80}
        className={styles.logo}
      />

      {/* Modals */}
      {selectedFlow && (
        <FlowModal
          isOpen={true}
          onClose={handleCloseModal}
          flow={selectedFlow}
          onSave={() => {
            handleCloseModal()
            fetchFlows()
          }}
        />
      )}

      {showNewFlowModal && (
        <NewFlowModal isOpen={true} onClose={handleCloseNewFlowModal} />
      )}
    </div>
  )
}
