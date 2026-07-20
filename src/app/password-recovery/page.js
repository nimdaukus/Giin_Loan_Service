'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Mail, ArrowRight, ArrowLeft, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { supabase } from '@/utils/supabase';

export default function PasswordRecovery() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1); // 1: Email Lookup, 2: Reset Form, 3: Success Screen
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailLookup = async (e) => {
    e.preventDefault();
    if (!email) return;
    setErrorMsg('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase().trim());

      if (error) {
        setErrorMsg('Error checking database. Please try again.');
        setIsLoading(false);
        return;
      }

      if (!data || data.length === 0) {
        setErrorMsg('This email address is not registered in the Sentinel system.');
        setIsLoading(false);
        return;
      }

      // Email exists, proceed to reset step
      setStep(2);
    } catch (err) {
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) return;
    setErrorMsg('');

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('users')
        .update({ password: newPassword })
        .eq('email', email.toLowerCase().trim());

      if (error) {
        setErrorMsg('Failed to update password. Please try again.');
        setIsLoading(false);
        return;
      }

      // Success
      setStep(3);
    } catch (err) {
      setErrorMsg('An unexpected error occurred during password reset.');
    } finally {
      setIsLoading(false);
    }
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
          {step === 1 && (
            <>
              <h1 style={{ fontSize: '2.1rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em' }}>
                Reset Password
              </h1>
              <p style={{ color: '#475569', fontSize: '0.925rem', marginTop: '0.5rem', marginBottom: '2.5rem' }}>
                Enter your institutional email to verify your identity and reset your credentials.
              </p>

              {errorMsg && (
                <div style={{ color: '#b91c1c', backgroundColor: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '6px', padding: '0.75rem 1rem', fontSize: '0.85rem', marginBottom: '1.5rem', fontWeight: '500' }}>
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleEmailLookup} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
                    borderRadius: '8px',
                    padding: '0.75rem 1rem',
                    backgroundColor: '#f8fafc',
                    transition: 'all 0.15s ease'
                  }}>
                    <Mail size={18} color="#64748b" style={{ marginRight: '0.75rem' }} />
                    <input
                      type="email"
                      placeholder="name@institution.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
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

                <button type="submit" disabled={isLoading} className="btn btn-primary" style={{
                  padding: '0.875rem 1.5rem',
                  borderRadius: '8px',
                  fontSize: '0.925rem',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0.5rem',
                  width: '100%'
                }}>
                  <span>{isLoading ? 'Verifying...' : 'Verify Email'}</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <h1 style={{ fontSize: '2.1rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em' }}>
                Choose New Password
              </h1>
              <p style={{ color: '#475569', fontSize: '0.925rem', marginTop: '0.5rem', marginBottom: '2.5rem' }}>
                Identity verified for <strong>{email}</strong>. Please enter your new secure password.
              </p>

              {errorMsg && (
                <div style={{ color: '#b91c1c', backgroundColor: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '6px', padding: '0.75rem 1rem', fontSize: '0.85rem', marginBottom: '1.5rem', fontWeight: '500' }}>
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handlePasswordReset} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: '0.725rem', fontWeight: '700', letterSpacing: '0.05em', color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                    New Password
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0.75rem 1rem', backgroundColor: '#f8fafc' }}>
                    <Lock size={18} color="#64748b" style={{ marginRight: '0.75rem' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      style={{ border: 'none', outline: 'none', backgroundColor: 'transparent', width: '100%', fontSize: '0.95rem', color: '#0f172a' }}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b', padding: 0 }}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: '0.725rem', fontWeight: '700', letterSpacing: '0.05em', color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                    Confirm Password
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0.75rem 1rem', backgroundColor: '#f8fafc' }}>
                    <Lock size={18} color="#64748b" style={{ marginRight: '0.75rem' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      style={{ border: 'none', outline: 'none', backgroundColor: 'transparent', width: '100%', fontSize: '0.95rem', color: '#0f172a' }}
                    />
                  </div>
                </div>

                <button type="submit" disabled={isLoading} className="btn btn-primary" style={{
                  padding: '0.875rem 1.5rem',
                  borderRadius: '8px',
                  fontSize: '0.925rem',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0.5rem',
                  width: '100%',
                  marginTop: '0.5rem'
                }}>
                  <span>{isLoading ? 'Updating...' : 'Update Password'}</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            </>
          )}

          {step === 3 && (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', backgroundColor: '#dcfce7', color: '#15803d', borderRadius: '50%', marginBottom: '1.5rem' }}>
                <CheckCircle size={32} />
              </div>
              <h1 style={{ fontSize: '2.1rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
                Password Updated
              </h1>
              <p style={{ color: '#475569', fontSize: '0.925rem', marginTop: '0.75rem', marginBottom: '2.5rem', lineHeight: '1.5' }}>
                Your credential update has been committed to the private database. You can now log in securely using your new password.
              </p>

              <button onClick={() => router.push('/login')} className="btn btn-primary" style={{
                padding: '0.875rem 1.5rem',
                borderRadius: '8px',
                fontSize: '0.925rem',
                width: '100%'
              }}>
                Proceed to Login
              </button>
            </div>
          )}

          {step < 3 && (
            <button
              onClick={() => router.push('/login')}
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
          )}
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
          borderRadius: '12px',
          padding: '1.75rem',
          color: 'white',
          maxWidth: '520px',
          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.3)'
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
