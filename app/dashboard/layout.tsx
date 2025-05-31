'use client';

import '../globals.css';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    // Este div “rompe” el centrado global con width:100vw,
    // obligando a que el Dashboard ocupe todo el ancho.
    <div style={{ width: '100vw', display: 'flex', height: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  );
}
