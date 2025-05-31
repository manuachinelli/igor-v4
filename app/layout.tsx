// app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.className}>
      <body
        style={{
          margin: 0,
          backgroundColor: '#000',
          color: '#fff',
          fontFamily: 'inherit',
          display: 'flex',
          height: '100vh',
        }}
      >
        {/* AQUÍ va TU menú global (la barra izquierda) definida en alguna parte */}
        {children}
      </body>
    </html>
  );
}
