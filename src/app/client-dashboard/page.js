'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, Landmark, FileText, ArrowRight, ShieldCheck, Clock, Calendar, CheckCircle2, ChevronRight, Activity } from 'lucide-react';

export default function ClientDashboard() {
  const router = useRouter();
  const { currentUser, loans, applications, activities, formatCurrency } = useApp();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Authorization Guard: client-only page
  if (!currentUser || currentUser.role !== 'Client') {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--color-danger)' }}>Access Denied</h2>
        <p>This portal is restricted to client accounts.</p>
        <button onClick={() => router.push('/dashboard')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Go to Oversight
        </button>
      </div>
    );
  }

  // Filter records belonging to the current client
  const clientLoans = loans.filter(l => l.email?.toLowerCase() === currentUser.email?.toLowerCase());
  const clientApps = applications.filter(a => a.email?.toLowerCase() === currentUser.email?.toLowerCase());
  const clientActs = activities.filter(a => a.userEmail?.toLowerCase() === currentUser.email?.toLowerCase());

  // Calculations
  const activeLoans = clientLoans.filter(l => l.status === 'Active');
  const pendingApps = clientApps.filter(a => a.status === 'Pending');
  
  const totalOutstanding = activeLoans.reduce((sum, l) => sum + (parseFloat(l.balance) || 0), 0);
  const totalBorrowed = clientLoans.reduce((sum, l) => sum + (parseFloat(l.amount) || 0), 0);
  const totalPaid = clientLoans.reduce((sum, l) => sum + (parseFloat(l.paid) || 0), 0);

  // Find next due date
  let nextDueDate = 'N/A';
  let nextDueAmount = 0;
  if (activeLoans.length > 0) {
    const sorted = [...activeLoans].sort((a, b) => new Date(a.repaymentDate) - new Date(b.repaymentDate));
    nextDueDate = sorted[0].repaymentDate;
    nextDueAmount = sorted[0].balance;
  }

  // Progress percentage
  const totalRepaymentExpected = totalBorrowed + (clientLoans.reduce((sum, l) => sum + (parseFloat(l.interestAmount) || 0), 0));
  const paidPercent = totalRepaymentExpected > 0 ? Math.round((totalPaid / totalRepaymentExpected) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Upper header segment */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Welcome back, {currentUser.name}
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Here is the status of your active credit lines and applications.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => router.push('/client-apply')} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Apply for Loan <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Primary Stats Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Debt Balance
          </span>
          <strong style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            {formatCurrency(totalOutstanding)}
          </strong>
          <span style={{ fontSize: '0.7rem', color: 'var(--color-success)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={12} /> {activeLoans.length} active credit lines
          </span>
        </div>

        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total Borrowed Value
          </span>
          <strong style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            {formatCurrency(totalBorrowed)}
          </strong>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
            Lifetime cumulative principal
          </span>
        </div>

        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total Settled Payments
          </span>
          <strong style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            {formatCurrency(totalPaid)}
          </strong>
          <span style={{ fontSize: '0.7rem', color: 'var(--color-success)', fontWeight: '600' }}>
            {paidPercent}% of expected repayment settled
          </span>
        </div>

        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Upcoming Repayment
          </span>
          <strong style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            {nextDueAmount > 0 ? formatCurrency(nextDueAmount) : 'No payments due'}
          </strong>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={12} /> Due: {nextDueDate}
          </span>
        </div>
      </div>

      {/* Visual Analytics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Settlement tracker & credit progress card */}
        <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Repayment Progress</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
              Your repayment ratio determines your eligibility for higher limits and lower interest rates.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* SVG Progress Circle */}
            <div style={{ position: 'relative', width: '100px', height: '100px', flexShrink: 0 }}>
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  stroke="var(--color-primary)" 
                  strokeWidth="8" 
                  fill="transparent" 
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * paidPercent) / 100}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: '800' }}>{paidPercent}%</span>
                <span style={{ fontSize: '0.55rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Paid</span>
              </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Outstanding Balance</span>
                <strong style={{ color: 'var(--text-primary)' }}>{formatCurrency(totalOutstanding)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Expected Surcharges</span>
                <strong style={{ color: 'var(--text-primary)' }}>0 RWF</strong>
              </div>
              <div style={{ height: '1px', backgroundColor: '#f1f5f9' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Total Settled Principal</span>
                <strong style={{ color: 'var(--color-success-text)', backgroundColor: 'var(--color-success-bg)', padding: '2px 6px', borderRadius: '4px' }}>
                  {formatCurrency(totalPaid)}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Credit rating & Standing */}
        <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: '#0f172a', color: 'white' }}>
          <div>
            <span style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              System Rating
            </span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginTop: '0.25rem' }}>Credit Standing</h3>
          </div>

          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--color-success)', letterSpacing: '-0.02em' }}>
              EXCELLENT
            </div>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>
              Grade A borrower node. Eligible for instant disbursements.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', padding: '0.75rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', fontSize: '0.7rem', color: '#94a3b8' }}>
            <ShieldCheck size={20} color="var(--color-primary)" style={{ flexShrink: 0 }} />
            <div>
              <strong>Instant Node Limit: 5,000,000 RWF</strong>
              <p style={{ marginTop: '0.15rem' }}>No pre-verifications required for subsequent applications.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of lists */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Recent Applications */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: '800' }}>Recent Applications</h3>
            <button onClick={() => router.push('/client-loans')} style={{ fontSize: '0.7rem', border: 'none', backgroundColor: 'transparent', color: 'var(--color-primary)', cursor: 'pointer', fontWeight: '700' }}>
              View All
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {clientApps.length === 0 ? (
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>No pending applications</p>
            ) : (
              clientApps.slice(0, 3).map(app => (
                <div key={app.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', border: '1px solid #f1f5f9', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '6px', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Landmark size={16} />
                    </div>
                    <div>
                      <strong style={{ fontSize: '0.8rem', display: 'block' }}>{app.type}</strong>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>ID: {app.id} • {app.date}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <strong style={{ fontSize: '0.8rem', display: 'block' }}>{formatCurrency(app.amount)}</strong>
                    <span style={{ 
                      fontSize: '0.65rem', 
                      fontWeight: '700', 
                      color: app.status === 'Approved' ? 'var(--color-success-text)' : app.status === 'Rejected' ? 'var(--color-danger-text)' : 'var(--color-warning-text)',
                      backgroundColor: app.status === 'Approved' ? 'var(--color-success-bg)' : app.status === 'Rejected' ? 'var(--color-danger-bg)' : 'var(--color-warning-bg)',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      {app.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity Log */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: '800' }}>Recent Account Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {clientActs.length === 0 ? (
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>No recent activities logged</p>
            ) : (
              clientActs.slice(0, 3).map(act => (
                <div key={act.id} style={{ display: 'flex', gap: '0.75rem', padding: '0.75rem', border: '1px solid #f1f5f9', borderRadius: '8px', alignItems: 'center' }}>
                  <div style={{ color: 'var(--text-secondary)' }}><Activity size={16} /></div>
                  <div style={{ flex: 1 }}>
                    <strong style={{ fontSize: '0.75rem', display: 'block' }}>{act.title}</strong>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>{act.desc}</p>
                  </div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{act.time}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
