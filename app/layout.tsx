// app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
export const metadata = {
  title: 'IGORS AI',
  icons: {
    icon: '/favicon.ico',
  },
};


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
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        {children}
      </body>
    </html>
  );
}
