'use client'

import AuthGuard from '@/components/AuthGuard'
import Sidebar from './Sidebar'
import ChatHistoryBar from '@/components/ChatHistoryBar'
import { usePathname } from 'next/navigation'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isChat = pathname === '/dashboard/chat'

  return (
    <AuthGuard>
      <div className={inter.className} style={{ display: 'flex', height: '100vh', margin: 0 }}>
        <Sidebar />
        {isChat && <ChatHistoryBar onNewChat={() => {}} />}
        <main style={{ flexGrow: 1, paddingLeft: isChat ? 0 : '80px' }}>
          {children}
        </main>
      </div>
    </AuthGuard>
  )
}
