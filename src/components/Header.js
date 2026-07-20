'use client';

import React, { useState } from 'react';
import { Search, RotateCw, History, Bell, User, LogOut } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  const { metrics, currentUser, setCurrentUser, refreshData, activities, applications } = useApp();
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);

  // Advanced interactive states
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showActivitiesDrawer, setShowActivitiesDrawer] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  if (!currentUser) return null;

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    
    // Play digital confirmation chime!
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 chord
      gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch (e) {}

    await refreshData();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <header className="header" style={{ position: 'relative' }}>
      <div className="header-search">
        <Search size={16} color="#64748b" />
        <input type="text" placeholder="Search applications, IDs, or borrowers..." />
      </div>

      <div className="header-actions">
        {/* Refresh Button */}
        <button 
          onClick={handleRefresh} 
          className="header-btn" 
          title="Refresh data"
          style={{ cursor: 'pointer' }}
        >
          <RotateCw 
            size={18} 
            style={{ 
              animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
              transition: 'transform 0.2s'
            }}
          />
        </button>

        {/* History / Audit Log Trigger */}
        <button 
          onClick={() => setShowActivitiesDrawer(true)} 
          className="header-btn" 
          title="Recent activity history"
          style={{ cursor: 'pointer' }}
        >
          <History size={18} />
        </button>

        {/* Bell Notifications Trigger */}
        <button 
          onClick={() => setShowNotifications(!showNotifications)} 
          className="header-btn" 
          title="Notifications"
          style={{ cursor: 'pointer', position: 'relative' }}
        >
          <Bell size={18} />
          {applications.filter(a => a.status === 'Pending').length > 0 && (
            <span className="badge-dot"></span>
          )}
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
                  setCurrentUser(null);
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

      {/* Global CSS spinner keyframe */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Bell Notifications dropdown popover */}
      {showNotifications && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 10px)',
          right: '50px',
          width: '320px',
          backgroundColor: 'white',
          border: '1px solid var(--border-color-dark)',
          borderRadius: '8px',
          boxShadow: 'var(--shadow-lg)',
          padding: '1rem',
          zIndex: 10000,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          cursor: 'default'
        }}>
          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>System Notifications</strong>
            <span style={{ fontSize: '0.65rem', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', fontWeight: '700', padding: '0.15rem 0.35rem', borderRadius: '4px' }}>
              {applications.filter(a => a.status === 'Pending').length} Alert(s)
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '250px', overflowY: 'auto' }}>
            {applications.filter(a => a.status === 'Pending').length === 0 ? (
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textAlign: 'center', padding: '1rem' }}>
                No pending applications. All caught up!
              </div>
            ) : (
              applications.filter(a => a.status === 'Pending').map(app => (
                <div 
                  key={app.id} 
                  onClick={() => {
                    setShowNotifications(false);
                    router.push('/approval-center');
                  }}
                  style={{ padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', transition: 'background-color 0.15s' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700' }}>
                    <span>{app.name}</span>
                    <span style={{ color: 'var(--color-primary)' }}>{app.id}</span>
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', marginTop: '0.15rem' }}>
                    Applied for RWF {app.amount.toLocaleString()} ({app.term})
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Forensic Activities sliding drawer */}
      {showActivitiesDrawer && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '380px',
          backgroundColor: 'rgba(15, 23, 42, 0.96)',
          backdropFilter: 'blur(15px)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
          zIndex: 99999,
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}>
          <style>{`
            @keyframes slideLeft {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
            }
          `}</style>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>📜</span> Forensic Activity Log
            </h3>
            <button 
              onClick={() => setShowActivitiesDrawer(false)}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.25rem' }}
            >
              &times;
            </button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {activities.length === 0 ? (
              <div style={{ color: '#64748b', textAlign: 'center', padding: '2rem', fontSize: '0.8rem' }}>No activity records found.</div>
            ) : (
              activities.map((act) => (
                <div key={act.id} style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '0.85rem', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <strong style={{ color: '#60a5fa' }}>{act.title}</strong>
                    <span style={{ fontSize: '0.65rem', color: '#64748b' }}>{act.time}</span>
                  </div>
                  <div style={{ color: '#cbd5e1', fontSize: '0.75rem', lineHeight: '1.4' }}>{act.desc}</div>
                  {act.userEmail && (
                    <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '0.35rem', fontStyle: 'italic' }}>
                      By: {act.userEmail}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </header>
  );
}
