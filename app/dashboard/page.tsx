'use client'

import './page.css'

export default function DashboardPage() {
  return (
    <div className="dashboard-container">
      <div className="metrics">
        <div className="metric">
          <div className="circle">35</div>
          <span>Procesos</span>
        </div>
        <div className="metric">
          <div className="circle">156</div>
          <span>Ejecuciones 24hs</span>
        </div>
        <div className="metric">
          <div className="circle">156</div>
          <span>Ejecuciones mes</span>
        </div>
        <div className="metric">
          <div className="circle error">3</div>
          <span>Errores</span>
        </div>
      </div>

      <div className="task-bar">
        <p>Tareas usadas: 22 / 50</p>
        <div className="progress-bar">
          <div className="progress" style={{ width: '44%' }}></div>
        </div>
      </div>
    </div>
  )
}
