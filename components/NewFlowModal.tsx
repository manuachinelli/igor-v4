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
          padding: '32px',
          borderRadius: '16px',
          minWidth: '500px',
          minHeight: '400px', // doble de alto aprox
          textAlign: 'center',
          color: '#000', // texto negro
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <h2 style={{ fontSize: '22px', fontWeight: '600' }}>Solicita un nuevo Flow</h2>

        <p style={{ fontSize: '14px', color: '#333', lineHeight: '1.5', maxWidth: '400px' }}>
          Si solicitás un Flow desde acá, nuestro equipo lo revisará manualmente y te lo configurará. 
          No es automático. Te avisaremos cuando esté listo.
        </p>

        <input
          type="text"
          placeholder="Nombre del Flow"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '14px',
            width: '100%',
            maxWidth: '400px',
          }}
        />

        {error && (
          <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px' }}>
          <button
            style={{
              padding: '10px 20px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#7B61FF',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '14px',
            }}
            onClick={handleCreateFlow}
          >
            Crear Flow
          </button>

          <button
            style={{
              padding: '10px 20px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              backgroundColor: '#fff',
              color: '#000',
              cursor: 'pointer',
              fontSize: '14px',
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
