'use client'

import Sidebar from './Sidebar'

export default function DashboardPage() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '60px', padding: '2rem', width: '100%' }}>
        <h1 style={{ color: 'white' }}>Dashboard de ejemplo</h1>
        {/* Aquí va el resto del contenido */}
      </div>
    </div>
  )
}
