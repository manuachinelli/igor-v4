'use client'

import Sidebar from './Sidebar'
import ChatHistoryBar from '@/components/ChatHistoryBar'
import { usePathname, useRouter } from 'next/navigation'
import { Inter } from 'next/font/google'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

const inter = Inter({ subsets: ['latin'] })

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const isChat = pathname === '/dashboard/chat'

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push('/')
      }
    }

    checkSession()
  }, [router])

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
