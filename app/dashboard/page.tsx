'use client';

import '@/app/dashboard/Dashboard.css';

export default function DashboardPage() {
  return (
    <div className="dashboard-container">
      <div className="dashboard-stats">
        <div className="stat">
          <div className="circle">35</div>
          <div className="label">Procesos</div>
        </div>
        <div className="stat">
          <div className="circle">156</div>
          <div className="label">Ejecuciones 24hs</div>
        </div>
        <div className="stat">
          <div className="circle">156</div>
          <div className="label">Ejecuciones mes</div>
        </div>
        <div className="stat">
          <div className="circle">3</div>
          <div className="label">Errores</div>
        </div>
      </div>
      <div className="progress-bar-container">
        <div className="progress-label">Tareas usadas: 22 / 50</div>
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: '44%' }}></div>
        </div>
      </div>
    </div>
  );
}
