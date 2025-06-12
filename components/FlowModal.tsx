'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

type FlowModalProps = {
  isOpen: boolean
  onClose: () => void
  flow: {
    id: string
    title: string
    executions_count: number
    executions_success_count: number
    state: string
    enabled: boolean
  }
  onSave: () => void
}

export function FlowModal({ isOpen, onClose, flow, onSave }: FlowModalProps) {
  const [enabled, setEnabled] = useState(flow.enabled)

  useEffect(() => {
    setEnabled(flow.enabled)
  }, [flow.enabled])

  const handleToggle = async () => {
    const newEnabled = !enabled
    setEnabled(newEnabled)

    const { error } = await supabase
      .from('dashboard_flows')
      .update({ enabled: newEnabled })
      .eq('id', flow.id)

    if (error) {
      console.error('Error updating enabled:', error)
    }
  }

  const totalExecutions = flow.executions_count
  const successExecutions = flow.executions_success_count

  const successRate = totalExecutions > 0 ? (successExecutions / totalExecutions) * 100 : 0

  if (!isOpen) return null

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
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          color: '#000',
        }}
      >
        {/* Toggle ON/OFF */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px' }}>Activado</span>
          <label className="switch">
            <input type="checkbox" checked={enabled} onChange={handleToggle} />
            <span className="slider round"></span>
          </label>
        </div>

        {/* Título */}
        <h2 style={{ fontSize: '20px' }}>{flow.title}</h2>

        {/* Status solo si está ON */}
        {enabled && (
          <div>
            <span
              style={{
                display: 'inline-block',
                padding: '4px 8px',
                borderRadius: '12px',
                backgroundColor: '#eee',
                fontSize: '12px',
              }}
            >
              Status: {flow.state}
            </span>
          </div>
        )}

        {/* Barra 1 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '14px' }}>Cantidad de ejecuciones</span>
          <div style={{ width: '100%', backgroundColor: '#eee', height: '12px', borderRadius: '6px' }}>
            <div
              style={{
                width: `${Math.min((totalExecutions / 10) * 100, 100)}%`,
                backgroundColor: '#7B61FF',
                height: '100%',
                borderRadius: '6px',
              }}
            />
          </div>
          <span style={{ fontSize: '12px' }}>{totalExecutions} ejecuciones</span>
        </div>

        {/* Barra 2 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '14px' }}>Cantidad de ejecuciones exitosas</span>
          <div style={{ width: '100%', backgroundColor: '#eee', height: '12px', borderRadius: '6px' }}>
            <div
              style={{
                width: `${Math.min(successRate, 100)}%`,
                backgroundColor: '#00FF7F',
                height: '100%',
                borderRadius: '6px',
              }}
            />
          </div>
          <span style={{ fontSize: '12px' }}>
            {successExecutions} exitosas ({successRate.toFixed(1)}%)
          </span>
        </div>

        {/* Botones */}
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '16px' }}>
          <button
            style={{
              padding: '8px 16px',
              cursor: 'pointer',
            }}
            onClick={onSave}
          >
            Guardar
          </button>

          <button
            style={{
              padding: '8px 16px',
              cursor: 'pointer',
            }}
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
