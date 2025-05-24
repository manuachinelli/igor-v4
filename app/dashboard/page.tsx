import Sidebar from '@/components/Sidebar'
import DashboardStats from '@/components/DashboardStats'
import ProgressBar from '@/components/ProgressBar'

export default function DashboardPage() {
  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: 'black', color: 'white', fontFamily: 'Inter, sans-serif' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <DashboardStats />
        <ProgressBar />
      </div>
    </div>
  )
}
