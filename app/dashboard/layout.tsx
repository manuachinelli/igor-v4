'use client'

import Sidebar from './Sidebar'
import ChatHistoryBar from '@/components/ChatHistoryBar'
import { usePathname } from 'next/navigation'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isChat = pathname === '/dashboard/chat'

  return (
    <div className={inter.className} style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      {isChat && <ChatHistoryBar onNewChat={() => {}} />}
      <div style={{ flexGrow: 1, paddingLeft: isChat ? 0 : '80px' }}>
        {children}
      </div>
    </div>
  )
}
