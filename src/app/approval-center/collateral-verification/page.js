'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowLeft, ZoomIn, RotateCw, CheckCircle, AlertTriangle, AlertCircle, HelpCircle, ShieldAlert, Check } from 'lucide-react';

export default function CollateralVerification() {
  const router = useRouter();
  
  // Interactive inspection thumbnail state
  const [activeInspectView, setActiveInspectView] = useState('main'); // 'main' | 'serial' | 'qr' | 'side'

  // Checklist interactive states
  const [checklist, setChecklist] = useState({
    serialMatches: false,
    physicalCondition: false,
    ownershipProof: false,
    blacklistChecked: false
  });

  const [notes, setNotes] = useState('');

  const isAllChecked = Object.values(checklist).every(val => val === true);

  const toggleCheck = (key) => {
    setChecklist(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleVerifyApprove = () => {
    if (!isAllChecked) {
      alert('Verification Failed: Please audit and check all checklist items before approval.');
      return;
    }
    alert('Collateral verified and signed off! Marcus Thorne loan application contract deployed.');
    router.push('/approval-center');
  };

  const handleMarkSuspect = () => {
    alert('Asset marked as Suspect. Alert triggered for risk assessment committee review.');
    router.push('/approval-center');
  };

  const handleRequestMoreInfo = () => {
    alert('Information request dispatched to Marcus Thorne via SMS and Email.');
  };

  return (
    <div>
      {/* Header breadcrumbs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
            <span>Approval Center</span>
            <span>/</span>
            <span style={{ color: 'var(--color-primary)' }}>Collateral Verification</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '0.25rem' }}>
            Collateral Inspection
          </h1>
        </div>
        <button onClick={() => router.push('/approval-center')} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <ArrowLeft size={16} /> Back to Approvals
        </button>
      </div>

      {/* Main Grid: 3 Columns */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.6fr 1fr',
        gap: '1.5rem',
        alignItems: 'start'
      }}>
        
        {/* Column 1: Profile & Metadata */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Borrower Profile Card */}
          <div className="card" style={{ padding: '1.25rem', margin: 0 }}>
            <h4 style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1rem', letterSpacing: '0.05em' }}>
              Borrower Profile
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                fontSize: '1.1rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                MT
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)' }}>Marcus Thorne</h3>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>ID: GIIN-7729-LX</span>
              </div>
            </div>

            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              padding: '0.875rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Loan Principal</span>
                <span style={{ fontWeight: '700', color: 'var(--color-primary)' }}>$1,250.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Category</span>
                <span style={{ fontWeight: '600' }}>Tech Collateral</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Tier</span>
                <span style={{ fontWeight: '600' }}>Platinum Alpha</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Risk Score</span>
                <span style={{ fontWeight: '700', color: 'var(--color-success)' }}>92/100</span>
              </div>
            </div>
          </div>

          {/* Asset Metadata Card */}
          <div className="card" style={{ padding: '1.25rem', margin: 0 }}>
            <h4 style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1rem', letterSpacing: '0.05em' }}>
              Asset Metadata
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Manufacturer</span>
                <span style={{ fontWeight: '600' }}>Apple Inc.</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Model</span>
                <span style={{ fontWeight: '600' }}>MacBook Pro M2 (2023)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Declared Value</span>
                <span style={{ fontWeight: '700', color: 'var(--color-primary)' }}>$2,100.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Collateral Inspection View (Center Workspace) */}
        <div className="card" style={{ padding: '1.5rem', margin: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)' }}>Collateral Inspection</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="header-btn" style={{ width: '28px', height: '28px' }} title="Zoom In"><ZoomIn size={14} /></button>
              <button className="header-btn" style={{ width: '28px', height: '28px' }} title="Rotate"><RotateCw size={14} /></button>
              <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--color-primary)', cursor: 'pointer', padding: '0.25rem 0.5rem' }}>FULL_SCREEN</span>
            </div>
          </div>

          {/* Active Inspection Display Box */}
          <div style={{
            height: '320px',
            backgroundColor: '#f1f5f9',
            border: '1px solid var(--border-color-dark)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            {activeInspectView === 'main' && (
              <img
                src="/images/laptop.png"
                alt="Inspected Collateral Macbook Laptop"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}
            
            {activeInspectView === 'serial' && (
              <div style={{
                textAlign: 'center',
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '8px',
                border: '1px dashed #cbd5e1',
                boxShadow: 'var(--shadow-sm)',
                maxWidth: '80%'
              }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '0.5rem' }}>
                  ENLARGED SERIAL CODE REGISTRY
                </div>
                <code style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--color-primary)', backgroundColor: '#eff6ff', padding: '0.5rem 1rem', borderRadius: '4px' }}>
                  AP-M2-8921-8X
                </code>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-success)', marginTop: '0.75rem', fontWeight: '600' }}>
                  ✓ Match verified on Apple Global database logs
                </div>
              </div>
            )}

            {activeInspectView === 'qr' && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}>
                <div style={{
                  width: '120px',
                  height: '120px',
                  backgroundColor: '#000000',
                  border: '8px solid white',
                  borderRadius: '4px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '4px',
                  padding: '4px'
                }}>
                  {/* Simulated QR Code blocks */}
                  <div style={{ backgroundColor: 'white' }}></div>
                  <div style={{ backgroundColor: 'black' }}></div>
                  <div style={{ backgroundColor: 'white' }}></div>
                  <div style={{ backgroundColor: 'black' }}></div>
                  <div style={{ backgroundColor: 'white' }}></div>
                  <div style={{ backgroundColor: 'black' }}></div>
                  <div style={{ backgroundColor: 'white' }}></div>
                  <div style={{ backgroundColor: 'black' }}></div>
                  <div style={{ backgroundColor: 'white' }}></div>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
                  QR Link: sentinel.giin/audit/7729
                </span>
              </div>
            )}

            {activeInspectView === 'side' && (
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', display: 'block' }}>SIDE PERSPECTIVE</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>USB ports and chassis thickness audited for custom modifications.</span>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: '700', marginTop: '0.5rem' }}>
                  PASS: No hardware spoof modifications detected.
                </div>
              </div>
            )}

            <div style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              color: 'white',
              fontSize: '0.65rem',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              fontWeight: '600'
            }}>
              {activeInspectView === 'main' ? '● MAIN PHOTO VIEW' : `● DETAILED ${activeInspectView.toUpperCase()} VIEW`}
            </div>
          </div>

          {/* Thumbnail Slider */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginTop: '1rem' }}>
            {[
              { id: 'main', label: 'Main View', preview: '/images/laptop.png' },
              { id: 'serial', label: 'Serial Sticker', isMock: true, icon: '🏷️' },
              { id: 'qr', label: 'QR Label', isMock: true, icon: '🔳' },
              { id: 'side', label: 'Side Chassis', isMock: true, icon: '🔌' }
            ].map((view) => (
              <div
                key={view.id}
                onClick={() => setActiveInspectView(view.id)}
                style={{
                  border: '2px solid ' + (activeInspectView === view.id ? 'var(--color-primary)' : 'var(--border-color-dark)'),
                  borderRadius: '6px',
                  overflow: 'hidden',
                  aspectRatio: '4/3',
                  cursor: 'pointer',
                  backgroundColor: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.125rem'
                }}
              >
                {view.isMock ? (
                  <>
                    <span style={{ fontSize: '1.25rem' }}>{view.icon}</span>
                    <span style={{ fontSize: '0.6rem', fontWeight: '600', color: 'var(--text-secondary)' }}>{view.label}</span>
                  </>
                ) : (
                  <img src={view.preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Laptop preview" />
                )}
              </div>
            ))}
          </div>

          {/* Buttons Drawer */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1.2fr',
            gap: '0.75rem',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '1.25rem',
            marginTop: '1.5rem'
          }}>
            <button onClick={handleRequestMoreInfo} className="btn btn-danger-outline" style={{ padding: '0.5rem' }}>
              Request More Info
            </button>
            <button onClick={handleMarkSuspect} className="btn btn-outline" style={{ padding: '0.5rem' }}>
              Mark as Suspect
            </button>
            <button
              onClick={handleVerifyApprove}
              className="btn btn-primary"
              disabled={!isAllChecked}
              style={{
                padding: '0.5rem',
                opacity: isAllChecked ? 1 : 0.6,
                cursor: isAllChecked ? 'pointer' : 'not-allowed'
              }}
            >
              <Check size={16} /> Verify & Approve
            </button>
          </div>
        </div>

        {/* Column 3: Checklist & Health check */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Verification Checklist */}
          <div className="card" style={{ padding: '1.25rem', margin: 0 }}>
            <h4 style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1rem', letterSpacing: '0.05em' }}>
              Verification Checklist
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { key: 'serialMatches', label: 'Serial Number Matches', sub: 'System ID: AP-M2-8921-8X' },
                { key: 'physicalCondition', label: 'Physical Condition Verified', sub: 'No visible scratches or liquid damage' },
                { key: 'ownershipProof', label: 'Ownership Proof Valid', sub: 'Receipt matches borrower name' },
                { key: 'blacklistChecked', label: 'IMEI / EID Registry', sub: 'Checked against global blacklist' }
              ].map((item) => (
                <div
                  key={item.key}
                  onClick={() => toggleCheck(item.key)}
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    alignItems: 'flex-start',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    backgroundColor: checklist[item.key] ? 'var(--color-primary-light)' : 'transparent',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checklist[item.key]}
                    readOnly
                    style={{ marginTop: '0.25rem', cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: '600', color: checklist[item.key] ? 'var(--color-primary)' : 'var(--text-primary)' }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '1.25rem' }}>
              <label style={{ fontSize: '0.7rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                Verification Notes
              </label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Enter administrative notes for the borrower's record..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{ fontSize: '0.75rem', resize: 'none' }}
              />
            </div>
          </div>

          {/* Automated Health Check Card */}
          <div className="card" style={{ padding: '1.25rem', margin: 0, backgroundColor: '#0b0f19', color: 'white', border: '1px solid #1e293b' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '1rem' }}>
              <ShieldCheck size={18} color="var(--color-success)" />
              <h4 style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Automated Health Check
              </h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                <span style={{ color: '#94a3b8' }}>Metadata Spoofing</span>
                <span style={{ fontWeight: '700', color: 'var(--color-success)' }}>PASSED</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                <span style={{ color: '#94a3b8' }}>AI Image Detection</span>
                <span style={{ fontWeight: '700', color: 'var(--color-success)' }}>0.02% PROB.</span>
              </div>
              <p style={{ fontSize: '0.7rem', color: '#94a3b8', lineHeight: '1.4', marginTop: '0.25rem' }}>
                System has flagged 0 anomalies in this image slot. Procedural approval recommended.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
