import Sidebar from './Sidebar';
import ChatHistoryBar from '@/components/ChatHistoryBar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <ChatHistoryBar />
      <div style={{ flexGrow: 1 }}>
        {children}
      </div>
    </div>
  );
}
