'use client';

import Sidebar from './Sidebar';
import ChatHistoryBar from '@/components/ChatHistoryBar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const handleNewChat = () => {
    window.location.reload();
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <ChatHistoryBar onNewChat={handleNewChat} />
      <div style={{ flexGrow: 1 }}>
        {children}
      </div>
    </div>
  );
}
