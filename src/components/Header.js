'use client';

import React, { useState } from 'react';
import { Search, RotateCw, History, Bell, User, LogOut } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  const { metrics, currentUser, setCurrentUser } = useApp();
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);

  return (
    <header className="header" style={{ position: 'relative' }}>
      <div className="header-search">
        <Search size={16} color="#64748b" />
        <input type="text" placeholder="Search applications, IDs, or borrowers..." />
      </div>

      <div className="header-actions">
        <button className="header-btn" title="Refresh data">
          <RotateCw size={18} />
        </button>
        <button className="header-btn" title="Recent activity history">
          <History size={18} />
        </button>
        <button className="header-btn" title="Notifications">
          <Bell size={18} />
          {metrics.pendingApprovals > 0 && <span className="badge-dot"></span>}
        </button>
        
        <div style={{ height: '24px', width: '1px', backgroundColor: '#e2e8f0', margin: '0 0.5rem' }}></div>
        
        {/* Profile trigger */}
        <div 
          onClick={() => setShowHeaderMenu(!showHeaderMenu)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', position: 'relative' }}
        >
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#1e293b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: '600',
            fontSize: '0.8rem'
          }}>
            {currentUser.initials}
          </div>
          <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#475569' }}>{currentUser.name}</span>

          {/* Floating dropdown overlay */}
          {showHeaderMenu && (
            <div 
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'absolute',
                top: 'calc(100% + 10px)',
                right: 0,
                width: '260px',
                backgroundColor: 'white',
                border: '1px solid var(--border-color-dark)',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-lg)',
                padding: '1rem',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                cursor: 'default'
              }}
            >
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.65rem', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', fontWeight: '700', padding: '0.15rem 0.35rem', borderRadius: '4px', textTransform: 'uppercase' }}>
                  {currentUser.role}
                </span>
                <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '0.35rem' }}>{currentUser.name}</strong>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{currentUser.email}</span>
              </div>

              {/* Edit parameters */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: '0.65rem' }}>Name</label>
                  <input 
                    type="text" 
                    className="form-control"
                    value={currentUser.name}
                    onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                    style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: '0.65rem' }}>Initials</label>
                  <input 
                    type="text" 
                    maxLength="3"
                    className="form-control"
                    value={currentUser.initials}
                    onChange={(e) => setCurrentUser({ ...currentUser, initials: e.target.value.toUpperCase() })}
                    style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
                  />
                </div>
              </div>

              <button 
                onClick={() => {
                  setShowHeaderMenu(false);
                  router.push('/login');
                }}
                className="btn btn-outline"
                style={{
                  width: '100%',
                  padding: '0.4rem',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: 'var(--color-danger-text)',
                  borderColor: 'rgba(239,68,68,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.25rem'
                }}
              >
                <LogOut size={12} /> Sign Out / Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
