export default function Sidebar() {
  const items = ['My IGOR', 'IGOR Catch Up', 'IGOR Automation', 'IGOR Flows']
  return (
    <div style={{
      width: '80px',
      backgroundColor: '#111',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: '2rem',
      gap: '2rem'
    }}>
      {items.map((label, index) => (
        <div key={index} title={label} style={{
          width: '40px',
          height: '40px',
          backgroundColor: '#333',
          borderRadius: '8px'
        }} />
      ))}
    </div>
  )
}
