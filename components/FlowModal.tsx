'use client'

type FlowModalProps = {
  isOpen: boolean
  onClose: () => void
  flow: any
  onSave: () => void
}

export function FlowModal({ isOpen, onClose, flow, onSave }: FlowModalProps) {
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
          minWidth: '340px',
          textAlign: 'center',
        }}
      >
        <h2>Flow: {flow.title}</h2>

        <button
          style={{
            marginTop: '16px',
            padding: '8px 16px',
            cursor: 'pointer',
          }}
          onClick={onSave}
        >
          Guardar
        </button>

        <button
          style={{
            marginTop: '16px',
            marginLeft: '16px',
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
