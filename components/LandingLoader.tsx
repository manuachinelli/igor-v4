'use client'
export default function LandingLoader() {
  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '24px',
      flexDirection: 'column'
    }}>
      <div style={{
        animation: 'pulse 1.5s infinite',
        fontWeight: 'bold'
      }}>
        Cargando IGOR...
      </div>
      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 0.3; }
          50% { opacity: 1; }
          100% { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}
