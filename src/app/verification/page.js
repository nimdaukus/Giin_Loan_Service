'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, ArrowRight, ArrowLeft, RefreshCw } from 'lucide-react';

export default function Verification() {
  const router = useRouter();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputsRef = useRef([]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    // Only allow digits
    if (isNaN(value)) return;

    const newCode = [...code];
    newCode[index] = value.substring(value.length - 1); // take only the last character
    setCode(newCode);

    // Auto-advance focus to next field
    if (value && index < 5 && inputsRef.current[index + 1]) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Backspace auto-retreats focus
    if (e.key === 'Backspace' && !code[index] && index > 0 && inputsRef.current[index - 1]) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').substring(0, 6);
    if (!pastedData) return;

    const newCode = [...code];
    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i];
    }
    setCode(newCode);

    // Focus last input that received paste
    const focusIndex = Math.min(pastedData.length - 1, 5);
    if (inputsRef.current[focusIndex]) {
      inputsRef.current[focusIndex].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpValue = code.join('');
    if (otpValue.length < 6) {
      alert('Please enter all 6 digits.');
      return;
    }

    alert('Verification Successful! Identity verified. Redirecting to Institutional Oversight Dashboard.');
    router.push('/dashboard');
  };

  const handleResend = () => {
    alert('A new 6-digit OTP has been sent to j***n@institution.com');
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem'
    }}>
      {/* Brand logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2.5rem' }}>
        <ShieldCheck size={32} color="#2563eb" />
        <span style={{ fontWeight: '800', fontSize: '1.4rem', color: '#0f172a' }}>GIIN Sentinel</span>
      </div>

      {/* Main OTP Verification Card */}
      <div className="card" style={{
        width: '100%',
        maxWidth: '480px',
        padding: '2.5rem',
        textAlign: 'center',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--border-color-dark)',
        backgroundColor: '#ffffff'
      }}>
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          backgroundColor: '#eff6ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#2563eb',
          margin: '0 auto 1.25rem'
        }}>
          <Lock size={24} />
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em' }}>
          Secure Verification
        </h2>
        
        <p style={{ color: '#475569', fontSize: '0.85rem', lineHeight: '1.5', marginTop: '0.5rem', marginBottom: '2rem' }}>
          We&apos;ve sent a 6-digit code to your email <strong style={{ color: '#0f172a' }}>j***n@institution.com</strong>.<br />
          Please enter it below to proceed.
        </p>

        {/* Inputs form */}
        <form onSubmit={handleSubmit}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '0.5rem',
            marginBottom: '1.5rem'
          }}>
            {code.map((digit, index) => (
              <input
                key={index}
                type="text"
                ref={el => inputsRef.current[index] = el}
                value={digit}
                maxLength="1"
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                style={{
                  height: '56px',
                  width: '100%',
                  textAlign: 'center',
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  border: '2px solid #cbd5e1',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: '#f8fafc',
                  outline: 'none',
                  transition: 'var(--transition-fast)'
                }}
                className="otp-input-box"
              />
            ))}
          </div>

          <button type="submit" className="btn btn-primary" style={{
            width: '100%',
            padding: '0.875rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.925rem',
            fontWeight: '600',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.25rem'
          }}>
            <span>Verify Identity</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Resend button */}
        <button
          onClick={handleResend}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#475569',
            fontSize: '0.8rem',
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem'
          }}
        >
          <RefreshCw size={12} />
          <span>Didn&apos;t receive the code? Resend code</span>
        </button>

        {/* Encryption seals */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginTop: '2rem',
          borderTop: '1px solid var(--border-color)',
          paddingTop: '1.25rem',
          fontSize: '0.65rem',
          color: '#94a3b8',
          fontWeight: '600'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            🔒 256-BIT ENCRYPTION
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            🛡️ ISO 27001
          </span>
        </div>
      </div>

      {/* Back to Login link */}
      <button
        onClick={() => router.push('/password-recovery')}
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
          marginTop: '1.5rem'
        }}
      >
        <ArrowLeft size={16} />
        <span>BACK TO LOGIN</span>
      </button>

      {/* Portal footer branding */}
      <div style={{
        marginTop: '3rem',
        textAlign: 'center',
        fontSize: '0.725rem',
        color: '#94a3b8',
        lineHeight: '1.6'
      }}>
        <div>© 2026 GIIN Sentinel. Secure Institutional Lending Portal.</div>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '0.25rem' }}>
          <a href="#" style={{ color: '#94a3b8', textDecoration: 'underline' }}>Security Whitepaper</a>
          <a href="#" style={{ color: '#94a3b8', textDecoration: 'underline' }}>Privacy Policy</a>
        </div>
      </div>
    </div>
  );
}
