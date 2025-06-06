'use client'

import React from 'react'

type NewFlowModalProps = {
  isOpen: boolean
  onClose: () => void
}

export default function NewFlowModal({ isOpen, onClose }: NewFlowModalProps) {
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
          minWidth: '300px',
          textAlign: 'center',
        }}
      >
        <h2 style={{ marginBottom: '16px' }}>Solicitar un nuevo Flow</h2>
        <p>Este es un modal de ejemplo para solicitar Flow.</p>
        <button
          style={{
            marginTop: '16px',
            padding: '8px 16px',
            cursor: 'pointer',
          }}
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  )
}
