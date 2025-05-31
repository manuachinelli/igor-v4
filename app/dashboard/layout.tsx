'use client';

-import '@/styles/globals.css';    // ajusta la ruta si tu globals está en otro lado
+import '../globals.css';

import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* 1) Mostramos el menú global (tu Sidebar original) */}
      <Sidebar />

      {/* 2) Aquí van las páginas hijas de /dashboard */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {children}
      </div>
    </div>
  );
}
