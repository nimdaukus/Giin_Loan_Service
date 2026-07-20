'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Landmark, ArrowLeft, Calendar, FileText, CheckCircle2, AlertCircle, Sparkles, CreditCard, ShieldCheck, Check } from 'lucide-react';

export default function ClientLoans() {
  const router = useRouter();
  const { currentUser, setCurrentUser, loans, applications, makePayment, formatCurrency } = useApp();
  const [mounted, setMounted] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('lines'); // 'lines' | 'requests'

  // Payment modal state
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [momoNumber, setMomoNumber] = useState('');
  const [momoProvider, setMomoProvider] = useState('MTN MoMo');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Authorization Guard: client-only page
  if (!currentUser || currentUser.role !== 'Client') {
    return (
      <div style={{ maxWidth: '500px', margin: '6rem auto', textAlign: 'center', padding: '2.5rem', border: '1px solid var(--border-color-dark)', borderRadius: '12px', backgroundColor: 'white', boxShadow: 'var(--shadow-md)' }}>
        <h2 style={{ color: 'var(--color-danger)', fontWeight: '800', fontSize: '1.5rem', marginBottom: '0.75rem' }}>Access Denied</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          You are currently logged in as a <strong>{currentUser?.role || 'Guest'}</strong>. This section is restricted to borrower/client accounts.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          {currentUser && (
            <button 
              onClick={() => router.push(currentUser.role === 'System Admin' || currentUser.role === 'Loan Officer' ? '/dashboard' : '/')}
              className="btn btn-primary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            >
              Go to Dashboard
            </button>
          )}
          <button 
            type="button"
            onClick={() => {
              setCurrentUser(null);
              router.push('/login');
            }}
            className="btn btn-outline"
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            Log Out & Switch Accounts
          </button>
        </div>
      </div>
    );
  }

  // Filter records belonging to current client
  const clientLoans = loans.filter(l => l.email?.toLowerCase() === currentUser.email?.toLowerCase());
  const clientApps = applications.filter(a => a.email?.toLowerCase() === currentUser.email?.toLowerCase());

  const handleOpenPayment = (loan) => {
    setSelectedLoan(loan);
    setPaymentAmount(loan.balance.toString());
    setMomoNumber(loan.phone || '0788000000');
    setPaymentSuccess(false);
  };

  const handleClosePayment = () => {
    setSelectedLoan(null);
    setPaymentSuccess(false);
  };

  const submitPayment = async (e) => {
    e.preventDefault();
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      alert('Please enter a valid amount.');
      return;
    }
    
    setIsProcessing(true);

    // Simulate MoMo Push USSD verification delay
    setTimeout(() => {
      makePayment(selectedLoan.id, parseFloat(paymentAmount));
      setIsProcessing(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        handleClosePayment();
      }, 2000);
    }, 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            My Credit Ledger
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Track your payment schedules, active obligations, and application queues.
          </p>
        </div>
        <button onClick={() => router.push('/client-apply')} className="btn btn-primary">
          New Loan Application
        </button>
      </div>

      {/* Tabs Menu */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveSubTab('lines')}
          style={{
            padding: '0.5rem 1rem',
            border: 'none',
            backgroundColor: 'transparent',
            color: activeSubTab === 'lines' ? 'var(--color-primary)' : 'var(--text-secondary)',
            fontWeight: activeSubTab === 'lines' ? '700' : '500',
            fontSize: '0.85rem',
            borderBottom: activeSubTab === 'lines' ? '2px solid var(--color-primary)' : 'none',
            cursor: 'pointer'
          }}
        >
          My Credit Lines ({clientLoans.length})
        </button>
        <button
          onClick={() => setActiveSubTab('requests')}
          style={{
            padding: '0.5rem 1rem',
            border: 'none',
            backgroundColor: 'transparent',
            color: activeSubTab === 'requests' ? 'var(--color-primary)' : 'var(--text-secondary)',
            fontWeight: activeSubTab === 'requests' ? '700' : '500',
            fontSize: '0.85rem',
            borderBottom: activeSubTab === 'requests' ? '2px solid var(--color-primary)' : 'none',
            cursor: 'pointer'
          }}
        >
          Credit Requests ({clientApps.length})
        </button>
      </div>

      {/* Main Content Area */}
      <div>
        {activeSubTab === 'lines' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {clientLoans.length === 0 ? (
              <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                <Landmark size={48} color="#cbd5e1" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>No Credit Lines Found</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', marginBottom: '1.5rem' }}>
                  You do not have any active or settled loans currently.
                </p>
                <button onClick={() => router.push('/client-apply')} className="btn btn-primary">
                  Submit an Application
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
                {clientLoans.map(loan => {
                  const percentPaid = Math.round((loan.paid / loan.totalRepayment) * 100) || 0;
                  const isCompleted = loan.status === 'Completed' || loan.balance <= 0;

                  return (
                    <div key={loan.id} className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', borderLeft: isCompleted ? '4px solid var(--color-success)' : '4px solid var(--color-primary)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: '800', backgroundColor: isCompleted ? 'var(--color-success-bg)' : 'var(--color-primary-light)', color: isCompleted ? 'var(--color-success-text)' : 'var(--color-primary)', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                          {isCompleted ? 'Settled' : 'Active'}
                        </span>
                        {!isCompleted && (
                          <span style={{ fontSize: '0.7rem', color: 'var(--color-danger)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={12} /> {loan.daysLeft} Days Left
                          </span>
                        )}
                      </div>

                      <div>
                        <strong style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {loan.id} • {loan.type}
                        </strong>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginTop: '0.25rem' }}>
                          {formatCurrency(loan.amount)}
                        </h3>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Repayment Value</span>
                          <strong style={{ color: 'var(--text-primary)' }}>{formatCurrency(loan.totalRepayment)}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Outstanding Balance</span>
                          <strong style={{ color: 'var(--color-danger)' }}>{formatCurrency(loan.balance)}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Settled Principal</span>
                          <strong style={{ color: 'var(--color-success-text)' }}>{formatCurrency(loan.paid)}</strong>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-secondary)', marginBottom: '0.375rem' }}>
                          <span>Repayment ratio</span>
                          <strong>{percentPaid}% Cleared</strong>
                        </div>
                        <div style={{ height: '6px', backgroundColor: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${percentPaid}%`, backgroundColor: isCompleted ? 'var(--color-success)' : 'var(--color-primary)', borderRadius: '3px', transition: 'width 0.5s ease' }}></div>
                        </div>
                      </div>

                      {!isCompleted && (
                        <button onClick={() => handleOpenPayment(loan)} className="btn btn-primary" style={{ width: '100%', padding: '0.6rem', fontSize: '0.8rem' }}>
                          Make Settle Payment
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '800' }}>Submitted Application Queue</h3>
            {clientApps.length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '3rem' }}>No applications submitted yet.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: 'var(--text-secondary)' }}>
                      <th style={{ padding: '0.75rem' }}>Application ID</th>
                      <th style={{ padding: '0.75rem' }}>Loan Class</th>
                      <th style={{ padding: '0.75rem' }}>Amount</th>
                      <th style={{ padding: '0.75rem' }}>Term Duration</th>
                      <th style={{ padding: '0.75rem' }}>Submission Date</th>
                      <th style={{ padding: '0.75rem' }}>Collateral Spec</th>
                      <th style={{ padding: '0.75rem' }}>Oversight Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientApps.map(app => (
                      <tr key={app.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.75rem', fontWeight: '700' }}>{app.id}</td>
                        <td style={{ padding: '0.75rem' }}>{app.type}</td>
                        <td style={{ padding: '0.75rem', fontWeight: '600' }}>{formatCurrency(app.amount)}</td>
                        <td style={{ padding: '0.75rem' }}>{app.term}</td>
                        <td style={{ padding: '0.75rem' }}>{app.date}</td>
                        <td style={{ padding: '0.75rem', color: 'var(--text-secondary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {app.collateralDesc}
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <span style={{
                            fontSize: '0.7rem',
                            fontWeight: '700',
                            color: app.status === 'Approved' ? 'var(--color-success-text)' : app.status === 'Rejected' ? 'var(--color-danger-text)' : 'var(--color-warning-text)',
                            backgroundColor: app.status === 'Approved' ? 'var(--color-success-bg)' : app.status === 'Rejected' ? 'var(--color-danger-bg)' : 'var(--color-warning-bg)',
                            padding: '2px 8px',
                            borderRadius: '4px'
                          }}>
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Payment Overlay Modal */}
      <AnimatePresence>
        {selectedLoan && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1.5rem'
          }}>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="card"
              style={{
                width: '100%',
                maxWidth: '460px',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
              }}
            >
              {paymentSuccess ? (
                <div style={{ textAlign: 'center', padding: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>MoMo Settle Authorized</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Your payment of {formatCurrency(parseFloat(paymentAmount))} was processed successfully! Credit ledgers synced.
                  </p>
                </div>
              ) : (
                <form onSubmit={submitPayment} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '800' }}>Mobile Money Settlement</h3>
                    <button type="button" onClick={handleClosePayment} style={{ border: 'none', backgroundColor: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
                  </div>

                  <div style={{ padding: '0.75rem', backgroundColor: '#fafafa', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Settle Account:</span>
                      <strong>{selectedLoan.id}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Obligation Due:</span>
                      <strong style={{ color: 'var(--color-danger)' }}>{formatCurrency(selectedLoan.balance)}</strong>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
                      Select Wallet Provider
                    </label>
                    <select
                      value={momoProvider}
                      onChange={(e) => setMomoProvider(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem', outline: 'none', cursor: 'pointer' }}
                    >
                      <option value="MTN MoMo">MTN MoMo (Rwanda)</option>
                      <option value="Airtel Money">Airtel Money (Rwanda)</option>
                      <option value="M-Pesa">M-Pesa (Kenya)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
                      Mobile Wallet Number
                    </label>
                    <input 
                      type="tel"
                      required
                      value={momoNumber}
                      onChange={(e) => setMomoNumber(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
                      Amount to Settle (RWF)
                    </label>
                    <input 
                      type="number"
                      required
                      max={selectedLoan.balance}
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem', outline: 'none' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '0.65rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}
                  >
                    {isProcessing ? 'Awaiting Wallet Pin Confirmation...' : 'Confirm MoMo Payment'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
