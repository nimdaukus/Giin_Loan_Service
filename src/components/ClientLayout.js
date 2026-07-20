'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { AppProvider, useApp } from '@/context/AppContext';

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  
  // Check if current route is a public authentication or landing page
  const isPublicPage = ['/', '/password-recovery', '/verification', '/login', '/signup', '/welcome', '/landing'].includes(pathname);

  return (
    <AppProvider>
      <LayoutContent isPublicPage={isPublicPage}>
        {children}
      </LayoutContent>
    </AppProvider>
  );
}

function LayoutContent({ children, isPublicPage }) {
  const { toast } = useApp();

  return (
    <>
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

      {/* Real-time Glassmorphic Toast Alert */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 999999,
          backgroundColor: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '12px',
          padding: '1.25rem',
          color: 'white',
          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.25), 0 8px 10px -6px rgb(0 0 0 / 0.25)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.375rem',
          maxWidth: '380px',
          animation: 'slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}>
          <style>{`
            @keyframes slideIn {
              from {
                transform: translateY(-24px) scale(0.95);
                opacity: 0;
              }
              to {
                transform: translateY(0) scale(1);
                opacity: 1;
              }
            }
          `}</style>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '800', fontSize: '0.85rem', color: '#60a5fa' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block', boxShadow: '0 0 8px #10b981' }}></span>
            {toast.title}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#cbd5e1', lineHeight: '1.4', fontWeight: '500' }}>
            {toast.desc}
          </div>
        </div>
      )}
    </>
  );
}
