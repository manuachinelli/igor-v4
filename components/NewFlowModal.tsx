'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type NewFlowModalProps = {
  isOpen: boolean
  onClose: () => void
}

export default function NewFlowModal({ isOpen, onClose }: NewFlowModalProps) {
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleCreateFlow = async () => {
    if (!title.trim()) {
      setError('El nombre del Flow es obligatorio.')
      return
    }

    const { error } = await supabase.from('dashboard_flows').insert([
      {
        title: title,
        state: 'requested',
      },
    ])

    if (error) {
      setError('Error al crear el Flow.')
    } else {
      setTitle('')
      setError('')
      onClose()
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
          minWidth: '340px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <h2>Solicita un nuevo Flow</h2>

        <p style={{ fontSize: '13px', color: '#555', lineHeight: '1.4' }}>
          Si solicitás un Flow desde acá, nuestro equipo lo revisará manualmente y te lo configurará. 
          No es automático. Te avisaremos cuando esté listo.
        </p>

        <input
          type="text"
          placeholder="Nombre del Flow"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontSize: '14px',
          }}
        />

        {error && (
          <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <button
            style={{
              padding: '8px 16px',
              cursor: 'pointer',
            }}
            onClick={handleCreateFlow}
          >
            Crear Flow
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
