export default function DashboardStats() {
  const stats = [
    { label: 'Procesos', value: 35 },
    { label: 'Ejecuciones 24hs', value: 156 },
    { label: 'Ejecuciones mes', value: 156 },
    { label: 'Errores', value: 3 }
  ]
  return (
    <div style={{ display: 'flex', gap: '2rem' }}>
      {stats.map((stat, index) => (
        <div key={index} style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          backgroundColor: '#222',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stat.value}</div>
          <div style={{ fontSize: '12px', marginTop: '4px' }}>{stat.label}</div>
        </div>
      ))}
    </div>
  )
}
