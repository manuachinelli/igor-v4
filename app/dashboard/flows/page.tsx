'use client'

import { useEffect, useState } from 'react'
import styles from './styles.module.css'
import Image from 'next/image'
import { FlowModal } from '@/components/FlowModal'
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
  enabled: boolean
}

export default function FlowsPage() {
  const [flows, setFlows] = useState<Flow[]>([])
  const [selectedFlow, setSelectedFlow] = useState<Flow | null>(null)
  const [showNewFlowModal, setShowNewFlowModal] = useState(false)

  const fetchFlows = async () => {
    const { data: userData } = await supabase.auth.getUser()
    const user_id = userData?.user?.id

    if (!user_id) {
      console.error('Error: No se pudo obtener el user_id.')
      return
    }

    const { data, error } = await supabase
      .from('dashboard_flows')
      .select('*')
      .eq('user_id', user_id)
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
    setShowNewFlowModal(true)
  }

  const handleCloseNewFlowModal = () => {
    setShowNewFlowModal(false)
    fetchFlows()
  }

  const handleToggleEnabled = async (flowId: string, currentEnabled: boolean) => {
    const newEnabled = !currentEnabled

    const { error } = await supabase
      .from('dashboard_flows')
      .update({ enabled: newEnabled })
      .eq('id', flowId)

    if (error) {
      console.error('Error updating enabled:', error)
      return
    }

    setFlows((prevFlows) =>
      prevFlows.map((flow) =>
        flow.id === flowId ? { ...flow, enabled: newEnabled } : flow
      )
    )
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
        return '#00FF7F'
      case 'error':
        return '#FFD700'
      case 'requested':
        return '#FF69B4'
      case 'review':
        return '#FF4500'
      default:
        return '#999999'
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.addButtonContainer}>
        <button className={styles.addButton} onClick={handleOpenNewFlow}>
          +
        </button>
        <p className={styles.addButtonText}>Solicita un nuevo flow</p>
      </div>

      <div className={styles.grid}>
        {flows.map((flow) => (
          <div key={flow.id} className={styles.flowButton}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '100%',
              }}
            >
              {/* Título clickable */}
             <button
  onClick={() => handleOpenFlow(flow)}
  style={{
    all: 'unset',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
    height: '100%',
  }}
>
  <div className={styles.flowContent}>
    <div className={styles.flowTitle}>{flow.title}</div>
    <div className={styles.flowLine} />
    <div
      className={styles.statusDot}
      style={{
        backgroundColor: getStateColor(flow.state),
        visibility: 'hidden', // oculto
      }}
    />
    <div
      className={styles.statusLabel}
      style={{
        visibility: 'hidden', // oculto
      }}
    >
      {getStateLabel(flow.state)}
    </div>
  </div>
</button>


              {/* Toggle ON/OFF abajo */}
              <div style={{ marginTop: '12px', marginBottom: '12px' }}>
                <label className={styles.toggleSwitch}>
                  <input
                    type="checkbox"
                    checked={flow.enabled}
                    onChange={() => handleToggleEnabled(flow.id, flow.enabled)}
                  />
                  <span className={styles.toggleSlider}></span>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Image
        src="/sidebar-icons/flows.png"
        alt="Flows Logo"
        width={80}
        height={80}
        className={styles.logo}
      />

      <div className={styles.batteryContainer}>
        <div className={styles.batteryBarOuter}>
          <div
            className={styles.batteryBarInner}
            style={{
              width: `${Math.min(flows.length / 5, 1) * 100}%`,
            }}
          />
        </div>
        <p className={styles.batteryText}>
          Te quedan {Math.max(5 - flows.length, 0)} flows disponibles,{' '}
          <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>
            clickea aquí para aumentar tu plan
          </span>
        </p>
      </div>

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
