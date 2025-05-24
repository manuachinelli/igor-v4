export default function DashboardPage() {
  return (
    <div style={{ padding: '2rem', color: 'white' }}>
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
        <StatCircle number={35} label="Procesos" />
        <StatCircle number={156} label="Ejecuciones 24hs" />
        <StatCircle number={156} label="Ejecuciones mes" />
        <StatCircle number={3} label="Errores" />
      </div>
      <div style={{ marginTop: 'auto' }}>
        <p>Tareas usadas: 22 / 50</p>
        <div style={{ backgroundColor: '#333', height: '20px', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ backgroundColor: 'limegreen', width: '44%', height: '100%' }} />
        </div>
      </div>
    </div>
  )
}

function StatCircle({ number, label }: { number: number; label: string }) {
  return (
    <div style={{
      backgroundColor: '#222',
      borderRadius: '50%',
      width: '100px',
      height: '100px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white'
    }}>
      <strong style={{ fontSize: '1.2rem' }}>{number}</strong>
      <span style={{ fontSize: '0.8rem', textAlign: 'center' }}>{label}</span>
    </div>
  )
}
