'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, Loader2, Users, Briefcase, Shield } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function InstitutionalLogin() {
  const router = useRouter();
  const { setCurrentUser } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState('System Admin'); // 'Client' | 'Loan Officer' | 'System Admin'

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    let profile = {
      name: 'Admin User',
      role: 'System Admin',
      initials: 'AD',
      email: email
    };
    
    if (role === 'Client') {
      profile = {
        name: 'Client Borrower',
        role: 'Client',
        initials: 'CB',
        email: email
      };
    } else if (role === 'Loan Officer') {
      profile = {
        name: 'Officer Desk',
        role: 'Loan Officer',
        initials: 'LO',
        email: email
      };
    }

    setCurrentUser(profile);

    // Simulate network authentication delay
    setTimeout(() => {
      setIsLoading(false);
      router.push('/verification');
    }, 1500);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      backgroundColor: '#f8fafc',
      fontFamily: 'Inter, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background glowing light blobs with gentle drift motion */}
      <motion.div
        animate={{
          y: [0, -30, 0],
          scale: [1, 1.12, 1],
          opacity: [0.12, 0.22, 0.12]
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />
      <motion.div
        animate={{
          y: [0, 30, 0],
          scale: [1, 1.15, 1],
          opacity: [0.12, 0.2, 0.12]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* Outer Card with Slide-Up Transition */}
      <motion.div
        initial={{ opacity: 0, y: 45 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '100%',
          maxWidth: '1000px',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e2e8f0',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 10
        }}
      >
        {/* Left Side: Form */}
        <div style={{
          padding: '3rem 2.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative'
        }}>
          {/* Subtle background dots texture */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            opacity: 0.25,
            pointerEvents: 'none'
          }}></div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Header Brand */}
            <div style={{ marginBottom: '2.5rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                GIIN SENTINEL
              </span>
              <p style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.25rem' }}>
                Institutional Lending Portal
              </p>
            </div>

            {/* Heading */}
            <div style={{ marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
                Welcome back
              </h1>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Please enter your credentials to access your secure institutional dashboard.
              </p>
            </div>

            {/* Role Selector Tabs */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '0.5rem',
              backgroundColor: '#f1f5f9',
              padding: '0.25rem',
              borderRadius: '8px',
              marginBottom: '1.5rem'
            }}>
              {[
                { name: 'Client', icon: Users },
                { name: 'Loan Officer', icon: Briefcase },
                { name: 'System Admin', icon: Shield }
              ].map(t => {
                const Icon = t.icon;
                const isSelected = role === t.name;
                return (
                  <button
                    key={t.name}
                    type="button"
                    onClick={() => setRole(t.name)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: '0.5rem 0.25rem',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: isSelected ? '#ffffff' : 'transparent',
                      color: isSelected ? 'var(--color-primary)' : 'var(--text-secondary)',
                      fontWeight: isSelected ? '700' : '500',
                      fontSize: '0.7rem',
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Icon size={14} />
                    {t.name}
                  </button>
                );
              })}
            </div>

            {/* Form */}
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label htmlFor="login-email" style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
                  Institutional Email
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}>
                    <Mail size={16} />
                  </span>
                  <input
                    id="login-email"
                    type="email"
                    required
                    placeholder="name@institution.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      backgroundColor: '#fafafa',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifySpaceBetween: 'space-between', marginBottom: '0.375rem', justifyContent: 'space-between' }}>
                  <label htmlFor="login-password" style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Password
                  </label>
                  <a href="/password-recovery" style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--color-primary)', textDecoration: 'none' }}>
                    Forgot password?
                  </a>
                </div>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}>
                    <Lock size={16} />
                  </span>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 2.5rem 0.75rem 2.5rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      backgroundColor: '#fafafa',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#94a3b8',
                      display: 'flex',
                      padding: 0
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.25rem' }}>
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ width: '14px', height: '14px', cursor: 'pointer' }}
                />
                <label htmlFor="remember-me" style={{ marginLeft: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  Remember this device for 30 days
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary pulse-glow-btn"
                style={{
                  width: '100%',
                  padding: '1rem',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginTop: '0.5rem',
                  boxShadow: '0 4px 10px rgba(0, 81, 213, 0.2)'
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Loggin in...
                  </>
                ) : (
                  <>
                    Secure Login <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <footer style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Need access to the GIIN Sentinel ecosystem?{' '}
                <a href="/signup" style={{ color: 'var(--color-primary)', fontWeight: '700', textDecoration: 'none' }}>
                  Create an institutional account
                </a>
              </p>
            </footer>
          </div>
        </div>

        {/* Right Side: Visual Graphic with smooth Image Load animations */}
        <div style={{
          backgroundImage: 'linear-gradient(to top, rgba(19, 27, 46, 0.95), rgba(19, 27, 46, 0.45))',
          backgroundColor: '#131b2e',
          padding: '3rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background image container inside right sidebar */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <motion.img
              initial={{ scale: 1.18, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.35 }}
              transition={{ duration: 1.8, ease: 'easeOut' }}
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJ_-uZ-JG8-6N5rQocvfikI6m_CTLjmBe1lgQRXWDp9sMLmmN_X2xIZdrOoafjb8JcWap6_AVXjyS41Ri5I5O8JCHcAoeb66njYSPAad4k1EbATnZL1Mn549jLjZBU7kZ5fC-Jzp4htZAms96b22uwM_kgPGgHZHle1PXkcmAVNbMkPr20i9BjjqkVfLE9cd82D_9RI0XNHhyHFdeKMRGWT79teLwRj1e6rHt_aQg8uOME6E_j7f1773jktIvwTZO_bph7NlwF2p20"
              alt="Lobby visual"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ maxWidth: '360px', position: 'relative', zIndex: 1 }}>
            <span style={{
              display: 'inline-block',
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              fontSize: '0.65rem',
              fontWeight: '800',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              letterSpacing: '0.05em',
              marginBottom: '1rem'
            }}>
              TRUSTED BY 500+ INSTITUTIONS
            </span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'white', lineHeight: '1.3', marginBottom: '1rem' }}>
              Precision Lending for a Modern Economy
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.5', marginBottom: '2rem' }}>
              GIIN Sentinel provides the infrastructure for secure, transparent, and high-velocity institutional credit. Access our proprietary risk models and liquidity pools with a single login.
            </p>

            <div style={{ display: 'flex', gap: '2rem' }}>
              <div>
                <strong style={{ fontSize: '1.25rem', fontWeight: '800', display: 'block', color: 'white' }}>$14.2B</strong>
                <span style={{ fontSize: '0.6rem', color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Capital Deployed</span>
              </div>
              <div>
                <strong style={{ fontSize: '1.25rem', fontWeight: '800', display: 'block', color: 'white' }}>99.9%</strong>
                <span style={{ fontSize: '0.6rem', color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Uptime Reliability</span>
              </div>
            </div>
          </div>

          <div style={{ position: 'absolute', top: '2rem', right: '2rem', width: '48px', height: '48px', borderTop: '2px solid rgba(255, 255, 255, 0.2)', borderRight: '2px solid rgba(255, 255, 255, 0.2)' }}></div>
        </div>
      </motion.div>
    </div>
  );
}
