'use client';

import React from 'react';

export default function DashboardPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', paddingLeft: '80px', paddingTop: '40px', color: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
        {[
          { number: 35, label: 'Procesos' },
          { number: 156, label: 'Ejecuciones 24hs' },
          { number: 156, label: 'Ejecuciones mes' },
          { number: 3, label: 'Errores' }
        ].map(({ number, label }, i) => (
          <div key={i} style={{
            backgroundColor: '#222',
            borderRadius: '50%',
            width: '100px',
            height: '100px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '18px'
          }}>
            <strong>{number}</strong>
            <small>{label}</small>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '40px', width: '60%', alignSelf: 'center' }}>
        <p style={{ marginBottom: '8px' }}>Tareas usadas: 22 / 50</p>
        <div style={{
          backgroundColor: '#444',
          borderRadius: '20px',
          height: '20px',
          overflow: 'hidden',
          display: 'flex'
        }}>
          <div style={{
            width: '44%',
            backgroundColor: '#28d428'
          }} />
        </div>
      </div>
    </div>
  );
}
