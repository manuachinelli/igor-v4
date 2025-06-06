'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type NewFlowModalProps = {
  isOpen: boolean
  onClose: () => void
}

export default function NewFlowModal({ isOpen, onClose }: NewFlowModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleCreateFlow = async () => {
    if (!title.trim() || !description.trim()) {
      setError('Todos los campos son obligatorios.')
      return
    }

    // Obtener el user_id desde Supabase Auth
    const { data: userData, error: userError } = await supabase.auth.getUser()
    const user_id = userData?.user?.id

    if (!user_id) {
      setError('Error: No se pudo obtener el usuario.')
      return
    }

    const { error } = await supabase.from('dashboard_flows').insert([
      {
        title: title,
        state: 'requested',
        description: description,
        user_id: user_id,
        executions_count: 0,
        executions_success_count: 0,
        executions_error_count: 0,
      },
    ])

    if (error) {
      setError('Error al crear el Flow.')
    } else {
      setTitle('')
      setDescription('')
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
          minHeight: '450px',
          textAlign: 'center',
          color: '#000',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <h2 style={{ fontSize: '22px', fontWeight: '600' }}>Solicita un nuevo Flow</h2>

        <p style={{ fontSize: '14px', color: '#333', lineHeight: '1.5', maxWidth: '400px' }}>
          Igor se pondrá a trabajar en el flow y te avisará cuando ya esté listo!
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

        <textarea
          placeholder="¿Qué querés automatizar?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '14px',
            width: '100%',
            maxWidth: '400px',
            minHeight: '100px',
            resize: 'none',
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
