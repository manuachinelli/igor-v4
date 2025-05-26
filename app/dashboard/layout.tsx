'use client';

import Sidebar from './Sidebar';
import ChatHistoryBar from '@/components/ChatHistoryBar';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      {pathname === '/dashboard/chat' && <ChatHistoryBar onNewChat={() => {}} />}
      <div style={{ flexGrow: 1 }}>
        {children}
      </div>
    </div>
  );
}
