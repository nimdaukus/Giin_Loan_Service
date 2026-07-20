'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { AppProvider } from '@/context/AppContext';

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  
  // Check if current route is a public authentication or landing page
  const isPublicPage = ['/', '/password-recovery', '/verification', '/login', '/signup', '/welcome', '/landing'].includes(pathname);

  return (
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
  );
}
