// File: app/ProactivePopup.tsx
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function ProactivePopup() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <button className="close-button" onClick={() => setVisible(false)}>×</button>
        <div className="logo-wrapper">
          <Image
            src="/sidebar-icons/proactive.png"
            alt="Igor Proactive"
            width={200}
            height={200}
          />
        </div>
        <h1>Igor Proactive</h1>
        <p>El primer agente que no espera órdenes. Las ejecuta.</p>
        <p>Decile “agendá reuniones con mis 5 mejores clientes” y listo.</p>
        <p>IGOR Proactive sale al ataque. Coordina. Escribe. Agenda.</p>
        <p>Mientras vos te enfocás en cerrar el trato.</p>
        <p>No es un asistente. Es tu brazo derecho. Y tiene hambre.</p>
      </div>
      <style jsx>{`
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #000;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10000;
        }
        .popup-container {
          position: relative;
          background: #000;
          color: #fff;
          padding: 32px;
          border-radius: 12px;
          max-width: 90%;
          text-align: center;
        }
        .close-button {
          position: absolute;
          top: 12px;
          right: 12px;
          background: none;
          border: none;
          color: #fff;
          font-size: 24px;
          cursor: pointer;
        }
        .logo-wrapper {
          margin-bottom: 16px;
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0% { opacity: 0.6; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1.05); }
          100% { opacity: 0.6; transform: scale(0.95); }
        }
        h1 {
          margin: 16px 0 8px;
          font-size: 28px;
        }
        p {
          margin: 4px 0;
          line-height: 1.4;
        }
      `}</style>
    </div>
  )
}
