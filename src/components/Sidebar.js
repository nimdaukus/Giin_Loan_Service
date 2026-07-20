'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, CheckSquare, BarChart2, Bell, Smartphone, ShieldCheck, ArrowLeft, HelpCircle, Settings, Landmark, Shield, FileText, Receipt } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { metrics, currentUser, setCurrentUser, t } = useApp();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const isClient = currentUser.role === 'Client';
  const isOfficer = currentUser.role === 'Loan Officer';

  const mainMenuItems = [
    ...(isClient ? [{ name: 'Mobile Client Portal', path: '/mobile', icon: Smartphone, badge: 0 }] : []),
    ...((!isClient) ? [
      { name: t('dashboard'), path: '/dashboard', icon: LayoutDashboard },
      { name: t('approvalCenter'), path: '/approval-center', icon: CheckSquare, badge: metrics.pendingApprovals },
      { name: t('disbursements'), path: '/disbursements', icon: Landmark },
      { name: t('mainTracker'), path: '/main-tracker', icon: BarChart2 },
      { name: t('invoiceTemplate'), path: '/invoices', icon: FileText },
      { name: t('receiptTemplate'), path: '/receipts', icon: Receipt },
      { name: t('riskHub'), path: '/portfolio', icon: BarChart2 },
      { name: t('auditCenter'), path: '/security', icon: Shield },
      { name: t('reminders'), path: '/reminders', icon: Bell }
    ] : [])
  ];

  const bottomMenuItems = [
    { name: t('support'), path: '/support', icon: HelpCircle },
    { name: t('settings'), path: '/settings', icon: Settings }
  ].filter(item => {
    if (isClient) {
      return item.path === '/support';
    }
    if (isOfficer && item.path === '/settings') {
      return false; // Hide settings for Loan Officers
    }
    return true;
  });

  return (
    <aside className="sidebar">
      {/* Brand logo header */}
      <div className="sidebar-brand">
        <ArrowLeft size={16} style={{ cursor: 'pointer', opacity: 0.7 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={24} color="#3b82f6" />
          <div>
            <div>GIIN Sentinel</div>
            <div className="sidebar-brand-sub">Institutional Admin</div>
          </div>
        </div>
      </div>

      {/* Main navigation list */}
      <ul className="sidebar-menu" style={{ flex: 1, overflowY: 'auto' }}>
        {mainMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <li key={item.name}>
              <Link
                href={item.path}
                className={`sidebar-item-link ${isActive ? 'active' : ''}`}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Icon size={18} />
                  <span>{item.name}</span>
                </div>
                {item.badge > 0 && (
                  <span
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontSize: '0.7rem',
                      padding: '0.1rem 0.4rem',
                      borderRadius: '50px',
                      fontWeight: '700'
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Bottom links section */}
      <ul className="sidebar-menu" style={{ flex: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>
        {bottomMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <li key={item.name}>
              <Link
                href={item.path}
                className={`sidebar-item-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* User profile footer with Settings & Logout Dropdown */}
      <div 
        className="sidebar-profile" 
        onClick={() => setShowProfileMenu(!showProfileMenu)}
        style={{ cursor: 'pointer', position: 'relative' }}
      >
        <div className="profile-avatar" style={{ backgroundColor: '#10b981' }}>
          {currentUser.initials}
        </div>
        <div className="profile-info">
          <div className="profile-name">{currentUser.name}</div>
          <div className="profile-role">{currentUser.role}</div>
        </div>

        {showProfileMenu && (
          <div 
            onClick={(e) => e.stopPropagation()} 
            style={{
              position: 'absolute',
              bottom: '100%',
              left: '10px',
              right: '10px',
              backgroundColor: '#1e293b',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '1rem',
              boxShadow: '0 -10px 25px rgba(0,0,0,0.3)',
              marginBottom: '0.75rem',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              cursor: 'default'
            }}
          >
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
              <strong style={{ fontSize: '0.85rem', color: 'white', display: 'block' }}>User Settings</strong>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{currentUser.email}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div>
                <label style={{ fontSize: '0.65rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>Full Name</label>
                <input 
                  type="text" 
                  value={currentUser.name}
                  onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.35rem 0.5rem',
                    fontSize: '0.75rem',
                    borderRadius: '4px',
                    border: '1px solid #475569',
                    backgroundColor: '#0f172a',
                    color: 'white',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.65rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>Initials</label>
                <input 
                  type="text" 
                  maxLength="3"
                  value={currentUser.initials}
                  onChange={(e) => setCurrentUser({ ...currentUser, initials: e.target.value.toUpperCase() })}
                  style={{
                    width: '100%',
                    padding: '0.35rem 0.5rem',
                    fontSize: '0.75rem',
                    borderRadius: '4px',
                    border: '1px solid #475569',
                    backgroundColor: '#0f172a',
                    color: 'white',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.65rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>Email Address</label>
                <input 
                  type="email" 
                  value={currentUser.email}
                  onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.35rem 0.5rem',
                    fontSize: '0.75rem',
                    borderRadius: '4px',
                    border: '1px solid #475569',
                    backgroundColor: '#0f172a',
                    color: 'white',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <button 
              onClick={() => {
                setShowProfileMenu(false);
                router.push('/login');
              }}
              style={{
                width: '100%',
                padding: '0.4rem',
                fontSize: '0.75rem',
                fontWeight: '700',
                borderRadius: '4px',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#f87171',
                cursor: 'pointer',
                textAlign: 'center',
                marginTop: '0.25rem',
                transition: 'background 0.2s'
              }}
            >
              Sign Out / Logout
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
