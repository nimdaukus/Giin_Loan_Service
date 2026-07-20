'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { User, Phone, FileText, Mail, MapPin, ShieldAlert, Check, X, ShieldCheck, Image as ImageIcon } from 'lucide-react';

export default function ApprovalCenter() {
  const { applications, approveApplication, rejectApplication } = useApp();
  
  // Filter pending/under review applications
  const pendingApps = applications.filter(
    app => app.status === 'Pending' || app.status === 'Under Review'
  );

  const [selectedAppId, setSelectedAppId] = useState('');

  // Automatically select the first pending application on mount or when list changes
  useEffect(() => {
    if (pendingApps.length > 0) {
      // Keep selection if it's still in the list, otherwise select first
      const stillExists = pendingApps.some(app => app.id === selectedAppId);
      if (!stillExists) {
        setSelectedAppId(pendingApps[0].id);
      }
    } else {
      setSelectedAppId('');
    }
  }, [applications, pendingApps, selectedAppId]);

  const selectedApp = pendingApps.find(app => app.id === selectedAppId);

  // Setup keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedApp) return;

      // Ctrl + Alt + A -> Approve
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        approveApplication(selectedApp.id);
      }
      // Ctrl + Alt + R -> Reject
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        rejectApplication(selectedApp.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedApp, approveApplication, rejectApplication]);

  const handleApprove = () => {
    if (selectedApp) {
      approveApplication(selectedApp.id);
    }
  };

  const handleReject = () => {
    if (selectedApp) {
      rejectApplication(selectedApp.id);
    }
  };

  return (
    <div>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Approval Center</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          Review documentation, verify collateral claims, and approve loan contracts.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '2rem',
        marginTop: '2rem',
        alignItems: 'start'
      }}>
        {/* Left Column: List of Applications */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div className="card-header" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <div>
              <h3 className="card-title" style={{ fontSize: '1rem' }}>Pending Applications</h3>
              <span className="card-subtitle">{pendingApps.length} applications need your decision</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.25rem' }}>
            {pendingApps.map((app) => (
              <div
                key={app.id}
                onClick={() => setSelectedAppId(app.id)}
                style={{
                  padding: '1.25rem',
                  border: '1px solid ' + (selectedAppId === app.id ? 'var(--color-primary)' : 'var(--border-color-dark)'),
                  backgroundColor: selectedAppId === app.id ? 'var(--color-primary-light)' : 'white',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: '700', color: selectedAppId === app.id ? 'var(--color-primary)' : 'var(--text-primary)' }}>
                      {app.name}
                    </span>
                    <span className={`badge ${app.status === 'Pending' ? 'warning' : 'danger'}`} style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                      {app.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    Requested: <strong style={{ color: 'var(--text-primary)' }}>{app.amount.toLocaleString()} MVP</strong> • Term: {app.term}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.date}</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>
                    {app.id}
                  </div>
                </div>
              </div>
            ))}

            {pendingApps.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                color: 'var(--text-secondary)',
                border: '1px dashed var(--border-color-dark)',
                borderRadius: 'var(--radius-md)'
              }}>
                <ShieldCheck size={40} color="var(--color-success)" style={{ marginBottom: '1rem', opacity: 0.8 }} />
                <h4 style={{ fontWeight: '700', color: 'var(--text-primary)' }}>All Caught Up!</h4>
                <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                  There are no pending applications. Create a new loan application in the Mobile App to test approvals.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Detailed Review */}
        {selectedApp ? (
          <div className="card" style={{ padding: '1.5rem', position: 'sticky', top: '90px' }}>
            <div style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                  Application Detail
                </span>
                <span className="badge warning" style={{ fontWeight: '700' }}>
                  {selectedApp.status} Review
                </span>
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '700', marginTop: '0.5rem', color: 'var(--text-primary)' }}>
                {selectedApp.name}
              </h2>
            </div>

            {/* Form Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Personal Information */}
              <div>
                <h4 style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <User size={14} /> Personal Information
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Phone Number</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.125rem' }}>
                      <Phone size={12} color="#64748b" /> {selectedApp.phone}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Passport Number</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.125rem' }}>
                      <FileText size={12} color="#64748b" /> {selectedApp.passport}
                    </div>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Email Address</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.125rem' }}>
                      <Mail size={12} color="#64748b" /> {selectedApp.email}
                    </div>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Postal Address</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.125rem' }}>
                      <MapPin size={12} color="#64748b" /> {selectedApp.address}
                    </div>
                  </div>
                </div>
              </div>

              {/* Loan details */}
              <div>
                <h4 style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <ShieldAlert size={14} /> Requested Loan Parameters
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', backgroundColor: '#f0f4f8', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color-dark)' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Requested Amount</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-primary)' }}>
                      {selectedApp.amount.toLocaleString()} MVP
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Term Length</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '700', marginTop: '0.25rem' }}>
                      {selectedApp.term}
                    </div>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Proposed Loan Type</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600', marginTop: '0.125rem' }}>
                      {selectedApp.type}
                    </div>
                  </div>
                </div>
              </div>

              {/* Collateral evidence */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.375rem', margin: 0 }}>
                    <ImageIcon size={14} /> Collateral Evidence
                  </h4>
                  <Link href="/approval-center/collateral-verification" style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-primary)', textDecoration: 'none' }}>
                    Verify Collateral →
                  </Link>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginTop: '0.5rem' }}>
                  {selectedApp.collateralDesc}
                </p>

                {/* Collateral Thumbnail Mockups */}
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
                  <div style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: '1px solid var(--border-color-dark)',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: '#f8fafc',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.25rem',
                    textAlign: 'center',
                    aspectRatio: '3/2'
                  }}>
                    <ImageIcon size={20} color="#64748b" />
                    <span style={{ fontSize: '0.7rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Ownership Deeds.pdf</span>
                    <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Verified File</span>
                  </div>
                  <div style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: '1px solid var(--border-color-dark)',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: '#f8fafc',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.25rem',
                    textAlign: 'center',
                    aspectRatio: '3/2'
                  }}>
                    <ImageIcon size={20} color="#64748b" />
                    <span style={{ fontSize: '0.7rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Valuation_Report.pdf</span>
                    <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Signed G-Docs</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.2fr',
              gap: '1rem',
              marginTop: '2rem',
              borderTop: '1px solid var(--border-color)',
              paddingTop: '1.25rem'
            }}>
              <button onClick={handleReject} className="btn btn-danger-outline" style={{ width: '100%' }}>
                <X size={16} /> Reject (Ctrl+Alt+R)
              </button>
              <button onClick={handleApprove} className="btn btn-primary" style={{ width: '100%' }}>
                <Check size={16} /> Approve Application
              </button>
            </div>
            
            <p style={{
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              textAlign: 'center',
              marginTop: '0.75rem'
            }}>
              Approving will automatically trigger smart contract deployment and allocate loan ledger variables.
            </p>
          </div>
        ) : (
          <div className="card" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4rem 2rem',
            color: 'var(--text-secondary)',
            height: '400px',
            textAlign: 'center'
          }}>
            <User size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
            <h4 style={{ fontWeight: '700', color: 'var(--text-primary)' }}>No Application Selected</h4>
            <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
              Select an application from the list to view full details and perform approval duties.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
