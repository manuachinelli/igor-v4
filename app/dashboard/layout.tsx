import Sidebar from './Sidebar';
import ChatHistoryBar from '@/components/ChatHistoryBar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const handleNewChat = () => {
    // Esto puede mejorar después, ahora simplemente refresca
    localStorage.removeItem('currentChat');
    location.reload();
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <ChatHistoryBar onNewChat={handleNewChat} />
      <div style={{ flexGrow: 1 }}>
        {children}
      </div>
    </div>
  );
}
