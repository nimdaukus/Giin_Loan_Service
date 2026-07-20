'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { Landmark, ArrowLeft, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';

export default function ClientApply() {
  const router = useRouter();
  const { currentUser, submitApplication } = useApp();
  const [mounted, setMounted] = useState(false);

  // Form states
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+250');
  const [passport, setPassport] = useState('');
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [term, setTerm] = useState('1-week');
  const [type, setType] = useState('Business Expansion Loan');
  const [collateralDesc, setCollateralDesc] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Clear all fields on entry
    setPhone('');
    setPassport('');
    setAddress('');
    setAmount('');
    setCollateralDesc('');
  }, []);

  if (!mounted) return null;

  // Authorization Guard: client-only page
  if (!currentUser || currentUser.role !== 'Client') {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--color-danger)' }}>Access Denied</h2>
        <p>This portal is restricted to client accounts.</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone || !passport || !address || !amount || !collateralDesc) {
      alert('Please fill out all fields before submitting.');
      return;
    }

    setIsLoading(true);

    const appData = {
      name: currentUser.name,
      email: currentUser.email,
      phone: `${countryCode} ${phone}`,
      passport,
      address,
      amount,
      term,
      type,
      collateralDesc
    };

    try {
      await submitApplication(appData);
      alert('Loan Application Submitted successfully! Redirecting to dashboard...');
      
      // Clear fields upon entry/submission
      setPhone('');
      setPassport('');
      setAddress('');
      setAmount('');
      setCollateralDesc('');

      router.push('/client-dashboard');
    } catch (err) {
      alert('Error submitting application: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Back navigation */}
      <div>
        <button 
          onClick={() => router.push('/client-dashboard')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', border: 'none', backgroundColor: 'transparent', color: 'var(--text-secondary)', fontSize: '0.85rem', cursor: 'pointer' }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.02em' }}>Apply for a Credit Line</h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Submit legal and financial descriptors to request a dynamic credit allocation.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
              Full Legal Name
            </label>
            <input 
              type="text" 
              readOnly 
              value={currentUser.name} 
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem', backgroundColor: '#f1f5f9', color: '#64748b', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
              Registered Email
            </label>
            <input 
              type="email" 
              readOnly 
              value={currentUser.email} 
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem', backgroundColor: '#f1f5f9', color: '#64748b', outline: 'none' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
              Phone Number
            </label>
            <div style={{ display: 'flex', gap: '0.375rem' }}>
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                style={{ padding: '0.75rem 0.5rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem', backgroundColor: '#fafafa', outline: 'none', width: '100px', cursor: 'pointer' }}
              >
                <option value="+250">RW (+250)</option>
                <option value="+1">US (+1)</option>
                <option value="+254">KE (+254)</option>
                <option value="+256">UG (+256)</option>
                <option value="+234">NG (+234)</option>
              </select>
              <input 
                type="tel" 
                required
                placeholder="788 000 000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ flex: 1, padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem', backgroundColor: '#fafafa', outline: 'none' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
              National ID / Passport
            </label>
            <input 
              type="text" 
              required
              placeholder="e.g. 1199580001000100"
              value={passport}
              onChange={(e) => setPassport(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem', backgroundColor: '#fafafa', outline: 'none' }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
            Physical Residential Address
          </label>
          <input 
            type="text" 
            required
            placeholder="e.g. KN 12 Ave, Kigali"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem', backgroundColor: '#fafafa', outline: 'none' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
              Requested Amount (RWF)
            </label>
            <input 
              type="number" 
              required
              placeholder="e.g. 500000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem', backgroundColor: '#fafafa', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
              Repayment Term
            </label>
            <select
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem', backgroundColor: '#fafafa', outline: 'none', cursor: 'pointer' }}
            >
              <option value="1-week">1 Week (15% Interest)</option>
              <option value="2-weeks">2 Weeks (25% Interest)</option>
              <option value="3-weeks">3 Weeks (30% Interest)</option>
              <option value="4-weeks">4 Weeks (35% Interest)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
              Credit Category
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem', backgroundColor: '#fafafa', outline: 'none', cursor: 'pointer' }}
            >
              <option value="Business Expansion Loan">Business Expansion</option>
              <option value="Emergency Credit Node">Emergency Node</option>
              <option value="Personal Bridging Fund">Personal Bridging</option>
            </select>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
            Collateral Security Asset Description
          </label>
          <textarea 
            required
            placeholder="e.g. iPhone 14 Pro Max 256GB Serial Number (G12345) and MacBook Pro M2"
            value={collateralDesc}
            onChange={(e) => setCollateralDesc(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem', backgroundColor: '#fafafa', outline: 'none', minHeight: '100px', resize: 'vertical' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', padding: '0.75rem', backgroundColor: 'var(--color-primary-light)', borderRadius: '8px', fontSize: '0.75rem', color: 'var(--color-primary-hover)' }}>
          <ShieldCheck size={20} style={{ flexShrink: 0 }} />
          <span>
            By submitting this application, you authorize GIIN Sentinel to lock and verify the collateral security assets described above in case of loan delinquency.
          </span>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary pulse-glow-btn"
          style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Processing Application...
            </>
          ) : (
            <>
              Submit Loan Application <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
