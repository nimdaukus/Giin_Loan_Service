'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Mail, ArrowRight, ArrowLeft, Lock } from 'lucide-react';

export default function PasswordRecovery() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    
    // Simulate sending recovery link, then redirect to OTP verification page
    alert(`Recovery token dispatched to: ${email}`);
    router.push('/verification');
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1.1fr',
      minHeight: '100vh',
      width: '100%',
      margin: 0,
      padding: 0
    }}>
      {/* Left side: Form */}
      <div style={{
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '3rem',
        maxWidth: '560px',
        margin: '0 auto',
        width: '100%'
      }}>
        {/* Brand logo header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={28} color="#2563eb" />
          <span style={{ fontWeight: '700', fontSize: '1.2rem', color: '#0f172a' }}>GIIN Sentinel</span>
        </div>

        {/* Form Container */}
        <div style={{ margin: '3rem 0' }}>
          <h1 style={{ fontSize: '2.1rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em' }}>
            Reset Password
          </h1>
          <p style={{ color: '#475569', fontSize: '0.925rem', marginTop: '0.5rem', marginBottom: '2.5rem' }}>
            Enter your institutional email to receive recovery instructions.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{
                fontSize: '0.725rem',
                fontWeight: '700',
                letterSpacing: '0.05em',
                color: '#64748b',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '0.5rem'
              }}>
                Institutional Email Address
              </label>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #cbd5e1',
                borderRadius: 'var(--radius-sm)',
                padding: '0.75rem 1rem',
                backgroundColor: '#f8fafc',
                transition: 'var(--transition-fast)'
              }} className="auth-input-container">
                <Mail size={18} color="#64748b" style={{ marginRight: '0.75rem' }} />
                <input
                  type="email"
                  placeholder="name@institution.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'transparent',
                    width: '100%',
                    fontSize: '0.95rem',
                    color: '#0f172a'
                  }}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{
              padding: '0.875rem 1.5rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.925rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.5rem',
              width: '100%'
            }}>
              <span>Send Recovery Link</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <button
            onClick={() => router.push('/')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#2563eb',
              fontSize: '0.875rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              margin: '1.5rem auto 0'
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Login</span>
          </button>
        </div>

        {/* Footer branding */}
        <div>
          <div style={{
            fontSize: '0.7rem',
            color: '#94a3b8',
            fontWeight: '600',
            letterSpacing: '0.03em',
            marginBottom: '0.75rem'
          }}>
            © 2026 GIIN SENTINEL. SECURE INSTITUTIONAL LENDING.
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <span style={{
              fontSize: '0.65rem',
              backgroundColor: '#f1f5f9',
              color: '#475569',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              fontWeight: '700'
            }}>
              AES-256 ENCRYPTED
            </span>
            <span style={{
              fontSize: '0.65rem',
              backgroundColor: '#f1f5f9',
              color: '#475569',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              fontWeight: '700'
            }}>
              ISO 27001
            </span>
          </div>
        </div>
      </div>

      {/* Right side: Image & Security Overlay */}
      <div style={{
        backgroundImage: 'url("/images/lobby.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '3rem'
      }}>
        {/* Dark overlay screen */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          zIndex: 1
        }}></div>

        {/* Glassmorphic overlay card */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 'var(--radius-md)',
          padding: '1.75rem',
          color: 'white',
          maxWidth: '520px',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              padding: '0.5rem',
              borderRadius: '8px',
              color: '#60a5fa',
              flexShrink: 0
            }}>
              <Lock size={20} />
            </div>
            <div>
              <h4 style={{ fontWeight: '700', fontSize: '0.95rem', color: '#ffffff' }}>Secure Verification</h4>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.375rem', lineHeight: '1.5' }}>
                To protect institutional assets, recovery links are valid for 15 minutes and require multi-factor authentication upon reset. Sentinel utilizes bi-directional encryption for all identity management processes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
