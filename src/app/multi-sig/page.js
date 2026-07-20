'use client';

import React, { useState } from 'react';
import { Key, ShieldCheck, Check, Clock, ShieldAlert, Cpu, ToggleLeft, ToggleRight, X, AlertCircle, Shield } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function MultiSigAuth() {
  const { currentUser } = useApp();
  const [maskData, setMaskData] = useState(true);
  const [activeQueueItem, setActiveQueueItem] = useState('LN-9012-XPT');
  const [signingStatus, setSigningStatus] = useState('idle'); // 'idle' | 'scanning' | 'success'

  const isAuthorized = currentUser?.role === 'System Admin' || currentUser?.role === 'GLOBAL ACCESS';

  if (!isAuthorized) {
    return (
      <div style={{
        padding: '3rem',
        textAlign: 'center',
        maxWidth: '500px',
        margin: '5rem auto',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-lg)',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: '#fef2f2',
          color: '#ef4444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem'
        }}>
          <Shield size={36} />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.75rem', color: '#0f172a' }}>Access Denied</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
          Your current account role ({currentUser?.role || 'Guest'}) lacks System Admin clearance to perform Multi-Signature signing operations.
        </p>
      </div>
    );
  }
  
  // Dynamic queue list
  const [queue, setQueue] = useState([
    {
      id: 'LN-9012-XPT',
      amount: 4250000,
      tier: 'Tier 1 Capital',
      maskedName: 'G***** L********* H*** E*********',
      fullName: 'George Lincoln Holding Enterprise',
      signatures: 2,
      totalRequired: 3,
      signedBy: ['Legal Verification', 'Risk Committee']
    },
    {
      id: 'LN-1522-ZYK',
      amount: 12000000,
      tier: 'Series A Debt',
      maskedName: 'R********* I**************** F***',
      fullName: 'Royal Investment Fund Corp',
      signatures: 1,
      totalRequired: 3,
      signedBy: ['Legal Verification']
    }
  ]);

  const activeItem = queue.find(item => item.id === activeQueueItem);

  const startSigningSequence = () => {
    setSigningStatus('scanning');
    
    setTimeout(() => {
      setSigningStatus('success');
      
      setTimeout(() => {
        // Increment signature count
        setQueue(prev =>
          prev.map(item => {
            if (item.id === activeQueueItem) {
              const newSigs = Math.min(item.totalRequired, item.signatures + 1);
              return { ...item, signatures: newSigs };
            }
            return item;
          })
        );
        alert(`Transaction ${activeQueueItem} signed successfully! Consensus reached (3/3). Disbursement initiated.`);
        setSigningStatus('idle');
      }, 1000);
    }, 1500);
  };

  const handleAlternate = () => {
    alert('Alternate signatory nominated. Notification dispatched.');
  };

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Multi-Signature Workflow</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Manage and authorize high-value disbursements requiring institutional consensus.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className="badge warning" style={{ fontSize: '0.75rem', fontWeight: '700', padding: '0.375rem 0.75rem' }}>
            Admin Level 3
          </span>
        </div>
      </div>

      {/* Sensitive mask toggle header */}
      <div className="card" style={{ padding: '0.875rem 1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
          Operational Privacy Guidelines
        </span>
        <button
          onClick={() => setMaskData(!maskData)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.85rem',
            fontWeight: '700',
            color: 'var(--color-primary)'
          }}
        >
          <span>Mask Sensitive Data</span>
          {maskData ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
        </button>
      </div>

      {/* 2-Column Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '2rem',
        alignItems: 'start'
      }}>
        {/* Left Column: Queue & Signature widget */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Pending Queue Card */}
          <div className="card" style={{ padding: '1.25rem', margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
              <h3 className="card-title" style={{ fontSize: '0.95rem' }}>Pending Signatures Queue</h3>
              <span className="badge warning" style={{ fontSize: '0.65rem', fontWeight: '700' }}>
                {queue.filter(q => q.signatures < q.totalRequired).length} ACTIONS REQUIRED
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {queue.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveQueueItem(item.id)}
                  style={{
                    padding: '1.25rem',
                    border: '1px solid ' + (activeQueueItem === item.id ? 'var(--color-primary)' : 'var(--border-color-dark)'),
                    backgroundColor: activeQueueItem === item.id ? 'var(--color-primary-light)' : 'white',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontWeight: '700', color: 'var(--color-primary)', fontSize: '0.85rem' }}>{item.id}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>{item.tier}</span>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginTop: '0.25rem', color: 'var(--text-primary)' }}>
                        {maskData ? item.maskedName : item.fullName}
                      </h4>
                    </div>
                    <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                      ${item.amount.toLocaleString()}
                    </div>
                  </div>

                  {/* Signatures status bar */}
                  <div style={{ marginTop: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                      <span>Signature Progress</span>
                      <strong>{item.signatures}/{item.totalRequired} Signed</strong>
                    </div>
                    <div className="progress-container" style={{ margin: 0, height: '6px' }}>
                      <div className="progress-bar" style={{ width: `${(item.signatures / item.totalRequired) * 100}%` }}></div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.375rem', marginTop: '0.5rem' }}>
                      {[...Array(item.totalRequired)].map((_, i) => (
                        <span
                          key={i}
                          style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            backgroundColor: i < item.signatures ? 'var(--color-success-bg)' : '#e2e8f0',
                            color: i < item.signatures ? 'var(--color-success)' : '#94a3b8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.6rem',
                            fontWeight: '700'
                          }}
                        >
                          {i < item.signatures ? '✓' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Biometrics signing card */}
          {activeItem ? (
            <div className="card" style={{
              backgroundColor: '#0b0f19',
              color: 'white',
              padding: '2rem',
              textAlign: 'center',
              border: '1px solid #1e293b',
              margin: 0
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                border: '1.5px solid rgba(59, 130, 246, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#60a5fa',
                margin: '0 auto 1.25rem'
              }}>
                <Key size={28} />
              </div>

              {signingStatus === 'idle' && (
                <>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'white' }}>Digital Signature Required</h3>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', maxWidth: '380px', margin: '0.5rem auto 1.5rem', lineHeight: '1.5' }}>
                    Authenticate with your hardware security key or biometric sensor to sign <strong style={{ color: 'white' }}>{activeItem.id}</strong>.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '300px', margin: '0 auto' }}>
                    <button onClick={startSigningSequence} className="btn btn-primary" style={{ padding: '0.75rem 1rem' }}>
                      Initialize Signature Sequence
                    </button>
                    <button onClick={handleAlternate} className="btn btn-outline" style={{ border: '1px solid #334155', color: '#94a3b8', padding: '0.75rem 1rem' }}>
                      Refer to Alternate Signatory
                    </button>
                  </div>
                  
                  <span style={{ fontSize: '0.65rem', color: '#64748b', display: 'block', marginTop: '1.25rem' }}>
                    AWAITING CRYPTOGRAPHIC HARDWARE...
                  </span>
                </>
              )}

              {signingStatus === 'scanning' && (
                <div style={{ padding: '2rem 0' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    border: '3px solid rgba(59, 130, 246, 0.2)',
                    borderTop: '3px solid #60a5fa',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 1rem'
                  }}></div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '700' }}>Reading Biometric Hardware...</h4>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>Do not remove security key from USB hub.</p>
                </div>
              )}

              {signingStatus === 'success' && (
                <div style={{ padding: '2rem 0', color: 'var(--color-success)' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem'
                  }}>
                    <Check size={28} />
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Biometrics Authenticated</h4>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>Ledger signing complete. Syncing block nodes...</p>
                </div>
              )}
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', margin: 0 }}>
              No active queue item selected.
            </div>
          )}
        </div>

        {/* Right Column: Hierarchy & Audit Trail */}
        {activeItem && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Approval Stepper Card */}
            <div className="card" style={{ padding: '1.25rem', margin: 0 }}>
              <h3 className="card-title" style={{ fontSize: '0.95rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
                Approval Hierarchy
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
                {/* Visual Connector Line */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  bottom: '1rem',
                  left: '14px',
                  width: '2px',
                  backgroundColor: '#e2e8f0',
                  zIndex: 1
                }}></div>

                {/* Step 1 */}
                <div style={{ display: 'flex', gap: '1rem', position: 'relative', zIndex: 2 }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-success)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem'
                  }}>
                    ✓
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>Legal Verification</strong>
                      <span className="badge success" style={{ fontSize: '0.6rem', padding: '0.1rem 0.375rem' }}>VERIFIED</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>
                      Approved by Sarah Jenkins (CLO)
                    </p>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Oct 24, 2026 • 14:22:10 UTC</span>
                  </div>
                </div>

                {/* Step 2 */}
                <div style={{ display: 'flex', gap: '1rem', position: 'relative', zIndex: 2 }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: activeItem.signatures >= 2 ? 'var(--color-success)' : 'var(--color-primary)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem'
                  }}>
                    {activeItem.signatures >= 2 ? '✓' : '2'}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>Risk Committee</strong>
                      <span className="badge success" style={{ fontSize: '0.6rem', padding: '0.1rem 0.375rem', backgroundColor: '#eff6ff', color: 'var(--color-primary)' }}>APPROVED</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>
                      Consensus: 4/5 members in favor
                    </p>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Oct 24, 2026 • 15:05:44 UTC</span>
                  </div>
                </div>

                {/* Step 3 */}
                <div style={{ display: 'flex', gap: '1rem', position: 'relative', zIndex: 2 }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: activeItem.signatures >= 3 ? 'var(--color-success)' : 'var(--color-warning)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: '700'
                  }}>
                    {activeItem.signatures >= 3 ? '✓' : '3'}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>Executive Director</strong>
                      <span className={`badge ${activeItem.signatures >= 3 ? 'success' : 'warning'}`} style={{ fontSize: '0.6rem', padding: '0.1rem 0.375rem' }}>
                        {activeItem.signatures >= 3 ? 'FINALIZED' : 'AWAITING YOU'}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>
                      {activeItem.signatures >= 3 ? 'Disbursement sign-off complete' : 'Final authorization for fund release'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cryptographic Audit Trail */}
            <div className="card" style={{ padding: '1.25rem', margin: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--color-primary)', fontWeight: '700', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
                <Cpu size={14} /> Cryptographic Audit Trail
              </div>
              
              <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', fontWeight: '700' }}>CURRENT BLOCK HIGH</span>
                <code style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', wordBreak: 'break-all', display: 'block', marginTop: '0.25rem', fontFamily: 'monospace' }}>
                  0x8f2a3ef1c09b42d32101f9247c132890db7210df1ef9cf4b1f630
                </code>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', fontSize: '0.75rem' }}>
                <span style={{ color: 'var(--color-success)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <ShieldCheck size={12} /> Blockchain Synced
                </span>
                <a href="#" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: '600' }}>View on Ledger</a>
              </div>
            </div>

            {/* Compliance box */}
            <div style={{
              backgroundColor: '#f1f5f9',
              padding: '1rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              lineHeight: '1.5'
            }}>
              <strong>Compliance Note:</strong> All signatures are legally binding under the Institutional Lending Framework (ILF-2024). Once finalized, this transaction cannot be reversed.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
