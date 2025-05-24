'use client';

import React from 'react';

export default function DashboardPage() {
  return (
    <div className="dashboard-container">
      <div className="dashboard-stats">
        <div className="circle">
          <div className="value">35</div>
          <div className="label">Procesos</div>
        </div>
        <div className="circle">
          <div className="value">156</div>
          <div className="label">Ejecuciones<br />24hs</div>
        </div>
        <div className="circle">
          <div className="value">156</div>
          <div className="label">Ejecuciones<br />mes</div>
        </div>
        <div className="circle">
          <div className="value error">3</div>
          <div className="label">Errores</div>
        </div>
      </div>
      <div className="dashboard-progress">
        <p>Tareas usadas: 22 / 50</p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '44%' }}></div>
        </div>
      </div>
    </div>
  );
}
