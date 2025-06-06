'use client'

import React from 'react'

type FlowModalProps = {
  isOpen: boolean
  onClose: () => void
  flow: {
    id: string
    user_id: string
    title: string
    state: string
    executions_count: number
    executions_success_count: number
    executions_error_count: number
  }
  onSave: () => void
}

export default function FlowModal({ isOpen, onClose, flow, onSave }: FlowModalProps) {
  if (!isOpen) return null

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

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          padding: '24px',
          borderRadius: '12px',
          minWidth: '400px',
          textAlign: 'center',
        }}
      >
        <h2 style={{ marginBottom: '16px' }}>{flow.title}</h2>
        <p><strong>Estado:</strong> {getStateLabel(flow.state)}</p>
        <p><strong>Ejecuciones totales:</strong> {flow.executions_count}</p>
        <p><strong>Con éxito:</strong> {flow.executions_success_count}</p>
        <p><strong>Con error:</strong> {flow.executions_error_count}</p>

        <button
          style={{
            marginTop: '16px',
            padding: '8px 16px',
            cursor: 'pointer',
          }}
          onClick={() => {
            onSave()
          }}
        >
          Guardar / Cerrar
        </button>
      </div>
    </div>
  )
}

