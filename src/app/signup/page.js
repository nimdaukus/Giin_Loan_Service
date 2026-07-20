'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, CheckCircle, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';

export default function InstitutionalSignUp() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState('System Admin'); // 'Client' | 'Loan Officer' | 'System Admin'

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+250');
  const [idType, setIdType] = useState('National ID');
  const [documentId, setDocumentId] = useState('');
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [tos, setTos] = useState(false);

  const handleNextStep = () => {
    if (!fullName || !email || !phone || !documentId) {
      alert('Please fill out all identity fields before continuing.');
      return;
    }
    setStep(2);
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!studentId || !password || !confirmPassword) {
      alert('Please fill out all credentials fields.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    if (!tos) {
      alert('You must agree to the Terms of Service and Security Protocols.');
      return;
    }
    
    setIsLoading(true);
    // Simulate API delay for loader visualization
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
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
      {/* Background glowing light blobs with drift motion */}
      <motion.div
        animate={{
          y: [0, -40, 0],
          scale: [1, 1.15, 1],
          opacity: [0.12, 0.2, 0.12]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-10%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />
      <motion.div
        animate={{
          y: [0, 40, 0],
          scale: [1, 1.2, 1],
          opacity: [0.12, 0.25, 0.12]
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-10%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* Outer Card with Slide-Up & Fade-In */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '100%',
          maxWidth: '960px',
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
        {/* Left Side: Branding & Trust */}
        <div style={{
          backgroundColor: '#131b2e',
          color: '#ffffff',
          padding: '3rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Internal floating grid design lines */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            opacity: 0.2
          }}></div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative', zIndex: 2 }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Shield size={20} />
              </div>
              <strong style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em' }}>GIIN Sentinel</strong>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: '800', lineHeight: '1.3', marginBottom: '1rem' }}>
                Secure Institutional Access
              </h1>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.5' }}>
                Join the global network for institutional lending. Our platform provides high-level security protocols for sovereign and corporate financial operations.
              </p>
            </div>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '2rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--color-primary)', fontWeight: '700' }}>✓</span>
                <div>
                  <h4 style={{ fontSize: '0.75rem', fontWeight: '800', color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em' }}>REGULATORY COMPLIANT</h4>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.125rem' }}>Fully aligned with international AML/KYC standards.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--color-primary)', fontWeight: '700' }}>✓</span>
                <div>
                  <h4 style={{ fontSize: '0.75rem', fontWeight: '800', color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em' }}>END-TO-END ENCRYPTION</h4>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.125rem' }}>Your sensitive institutional data is vaulted at every step.</p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '3rem', position: 'relative', borderRadius: '8px', overflow: 'hidden', height: '120px', zIndex: 2 }}>
            <motion.img
              initial={{ scale: 1.15, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.25 }}
              transition={{ duration: 1.5 }}
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2i6HJ6deCF_uvgvdNfa8W9T6apmUnzS1IxhA2dwX4hxG_mWExEZk412wrz5lSMVtSNbwFHISUZ9Pwb9xn6REKUEjuyrRLkcvyQfmUIg9paVVvmJWkq5oe6bF2etmkIrB5hqjU2cD9KlcnUVV5i3_uE03BETcS11weQN10h8AlqYvssdT-vlPV9S-QDJX6NMgOjeN4gpq1hnnIX5oMFupUWNfjMWslQJWlbNY6YbadZfXW5bfQqc7NT4LQKhf-5wARA2DxTjjjYNSX"
              alt="Building facade"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #131b2e 10%, transparent)' }}></div>
          </div>
        </div>

        {/* Right Side: Form View */}
        <div style={{ padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                style={{ textAlign: 'center', padding: '2rem 0' }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-success-bg)',
                    color: 'var(--color-success)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem'
                  }}
                >
                  <CheckCircle size={36} />
                </motion.div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.75rem' }}>Verification Sent</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '2rem' }}>
                  Please check your institutional email address to verify your identity and complete the account activation process.
                </p>
                <button
                  type="button"
                  onClick={() => router.push('/login')}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.75rem' }}
                >
                  Return to Login
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="form-stepper"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {/* Step indicator */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                  <div style={{ height: '4px', flex: 1, backgroundColor: 'var(--color-primary)', borderRadius: '2px' }}></div>
                  <div style={{ height: '4px', flex: 1, backgroundColor: step === 2 ? 'var(--color-primary)' : '#e2e8f0', borderRadius: '2px' }}></div>
                </div>

                <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.25rem' }}>Create your account</h2>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                  {step === 1 ? 'Step 1: Primary Identity & Contact' : 'Step 2: Credentials & Verification'}
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <AnimatePresence mode="wait">
                    {step === 1 ? (
                      <motion.div
                        key="step-1-fields"
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 15 }}
                        transition={{ duration: 0.25 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
                      >
                        <div>
                          <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
                            Account Type / Access Role
                          </label>
                          <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '0.75rem',
                              border: '1px solid #e2e8f0',
                              borderRadius: '8px',
                              fontSize: '0.85rem',
                              backgroundColor: '#fafafa',
                              outline: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="Client">Client / Borrower</option>
                            <option value="Loan Officer">Loan Officer / Staff</option>
                            <option value="System Admin">System Admin / Institutional Admin</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
                            Full Legal Name
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Alexander Sterling"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem', backgroundColor: '#fafafa', outline: 'none' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
                            Institutional Email
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="name@institution.org"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem', backgroundColor: '#fafafa', outline: 'none' }}
                          />
                        </div>

                        {/* Stacking fields vertically to ensure zero document width clipping / text overflows */}
                        <div>
                          <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
                            Phone Number
                          </label>
                          <div style={{ display: 'flex', gap: '0.375rem' }}>
                            <select
                              value={countryCode}
                              onChange={(e) => setCountryCode(e.target.value)}
                              style={{
                                padding: '0.75rem 0.5rem',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                fontSize: '0.85rem',
                                backgroundColor: '#fafafa',
                                outline: 'none',
                                width: '110px',
                                cursor: 'pointer'
                              }}
                            >
                              <option value="+250">RW (+250)</option>
                              <option value="+1">US (+1)</option>
                              <option value="+254">KE (+254)</option>
                              <option value="+256">UG (+256)</option>
                              <option value="+234">NG (+234)</option>
                              <option value="+44">UK (+44)</option>
                              <option value="+27">ZA (+27)</option>
                            </select>
                            <input
                              type="tel"
                              required
                              placeholder="788 000 000"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              style={{
                                flex: 1,
                                padding: '0.75rem',
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
                          <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
                            ID Document
                          </label>
                          <div style={{ display: 'flex', gap: '0.375rem' }}>
                            <select
                              value={idType}
                              onChange={(e) => setIdType(e.target.value)}
                              style={{
                                padding: '0.75rem 0.5rem',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                fontSize: '0.85rem',
                                backgroundColor: '#fafafa',
                                outline: 'none',
                                width: '140px',
                                cursor: 'pointer'
                              }}
                            >
                              <option value="National ID">National ID</option>
                              <option value="Passport">Passport</option>
                            </select>
                            <input
                              type="text"
                              required
                              placeholder={idType === 'National ID' ? 'Enter National ID number' : 'Enter Passport number'}
                              value={documentId}
                              onChange={(e) => setDocumentId(e.target.value)}
                              style={{
                                flex: 1,
                                padding: '0.75rem',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                fontSize: '0.85rem',
                                backgroundColor: '#fafafa',
                                outline: 'none'
                              }}
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleNextStep}
                          className="btn btn-primary pulse-glow-btn"
                          style={{ width: '100%', padding: '0.875rem', fontSize: '0.85rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}
                        >
                          Continue <ArrowRight size={16} />
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="step-2-fields"
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        transition={{ duration: 0.25 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
                      >
                        <div>
                          <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
                            Institutional Student/Registration ID
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="INST-9920-X"
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem', backgroundColor: '#fafafa', outline: 'none' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
                            Create Password
                          </label>
                          <input
                            type="password"
                            required
                            placeholder="Min. 12 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem', backgroundColor: '#fafafa', outline: 'none' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
                            Confirm Password
                          </label>
                          <input
                            type="password"
                            required
                            placeholder="Repeat password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem', backgroundColor: '#fafafa', outline: 'none' }}
                          />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'flex-start', margin: '0.25rem 0' }}>
                          <input
                            id="signup-tos"
                            type="checkbox"
                            checked={tos}
                            onChange={(e) => setTos(e.target.checked)}
                            style={{ width: '14px', height: '14px', cursor: 'pointer', marginTop: '3px' }}
                          />
                          <label htmlFor="signup-tos" style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4', cursor: 'pointer' }}>
                            I agree to the <a href="#" style={{ color: 'var(--color-primary)', fontWeight: '700', textDecoration: 'none' }}>Terms of Service</a> and <a href="#" style={{ color: 'var(--color-primary)', fontWeight: '700', textDecoration: 'none' }}>Security Protocols</a> for institutional account holders.
                          </label>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                          <button
                            type="button"
                            onClick={handlePrevStep}
                            className="btn btn-outline"
                            style={{ flex: 1, padding: '0.75rem', fontSize: '0.8rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.25rem' }}
                          >
                            <ArrowLeft size={16} /> Back
                          </button>
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="btn btn-primary pulse-glow-btn"
                            style={{ flex: 2, padding: '0.75rem', fontSize: '0.8rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                          >
                            {isLoading ? (
                              <>
                                <Loader2 size={16} className="animate-spin" /> Verifying...
                              </>
                            ) : (
                              'Create Account'
                            )}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>

                <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Already have an institutional account?{' '}
                    <a href="/login" style={{ color: 'var(--color-primary)', fontWeight: '700', textDecoration: 'none' }}>
                      Log in here
                    </a>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div >
    </div >
  );
}
