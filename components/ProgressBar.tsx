export default function ProgressBar() {
  return (
    <div style={{ width: '100%', marginTop: '2rem' }}>
      <p style={{ marginBottom: '0.5rem' }}>Tareas usadas: 22 / 50</p>
      <div style={{
        width: '100%',
        height: '20px',
        backgroundColor: '#333',
        borderRadius: '10px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: '44%',
          height: '100%',
          backgroundColor: 'limegreen'
        }} />
      </div>
    </div>
  )
}
