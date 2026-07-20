'use client';

import { AppProvider } from '@/context/AppContext';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { usePathname } from 'next/navigation';
import './globals.css';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  
  // Check if current route is a public authentication or landing page
  const isPublicPage = ['/', '/password-recovery', '/verification', '/login', '/signup', '/welcome', '/landing'].includes(pathname);

  return (
    <html lang="en">
      <head>
        <title>GIIN Sentinel - Institutional Oversight</title>
        <meta name="description" content="Monitor and approve institutional loans." />
      </head>
      <body>
        <AppProvider>
          {isPublicPage ? (
            <main style={{ minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
              {children}
            </main>
          ) : (
            <div className="app-container">
              <Sidebar />
              <div className="main-content">
                <Header />
                <main className="page-body">
                  {children}
                </main>
              </div>
            </div>
          )}
        </AppProvider>
      </body>
    </html>
  );
}
