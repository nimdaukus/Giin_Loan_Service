'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Printer, Download, Send, Shield, BookOpen, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function InvoicePreview() {
  const { loans, applications } = useApp();

  // Combine active loans and approved applications as eligible invoice accounts
  const activeAccounts = [
    ...loans.map(l => ({ id: l.id, name: l.borrowerName, amount: l.amount, type: l.type, interestRate: l.interestRate, daysLeft: l.daysLeft, email: l.email, phone: l.phone, address: l.address, passport: l.passport, collateralDesc: l.collateralDesc })),
    ...applications.filter(a => a.status === 'Approved').map(a => ({ id: a.id, name: a.name, amount: a.amount, type: a.type, interestRate: '12.0%', daysLeft: 30, email: a.email, phone: a.phone, address: a.address, passport: a.passport, collateralDesc: a.collateralDesc }))
  ];

  const [selectedAccountId, setSelectedAccountId] = useState(activeAccounts[0]?.id || '');
  const [isOverdue, setIsOverdue] = useState(false);
  const [delayDays, setDelayDays] = useState(5);
  const [penaltyRate, setPenaltyRate] = useState(1.5); // 1.5% per day penalty
  const [isSending, setIsSending] = useState(false);

  const account = activeAccounts.find(acc => acc.id === selectedAccountId);

  const printInvoice = () => {
    window.print();
  };

  const handleSendInvoice = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      alert(`Invoice successfully dispatched to ${account.name} via secure email.`);
    }, 1200);
  };

  // Calculations
  const rateNum = account ? parseFloat(account.interestRate) || 0 : 0;
  const adminInterest = account ? Math.round(account.amount * (rateNum / 100)) : 0;
  
  // Penalty calculation
  const penaltyAmount = isOverdue && account
    ? Math.round(account.amount * (parseFloat(penaltyRate) / 100) * parseInt(delayDays || 0))
    : 0;

  const totalDue = account
    ? account.amount + adminInterest + penaltyAmount
    : 0;

  return (
    <div>
      {/* Selection Control Panel */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }} className="no-print">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Invoice Generation Hub</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Preview, modify, and distribute invoices. Apply delay charges in case of overdue balances.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Select Recipient:</label>
          <select
            value={selectedAccountId}
            onChange={(e) => {
              setSelectedAccountId(e.target.value);
              const target = activeAccounts.find(a => a.id === e.target.value);
              setIsOverdue(target ? target.daysLeft === 0 : false);
            }}
            style={{
              border: '1px solid var(--border-color-dark)',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              backgroundColor: 'white',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {activeAccounts.map(acc => (
              <option key={acc.id} value={acc.id}>
                {acc.name} ({acc.id.startsWith('LOAN') ? 'Active Loan' : 'Approved App'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {!account ? (
        <div style={{ textAlign: 'center', padding: '4rem' }} className="card">
          <AlertTriangle size={48} color="var(--color-danger)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>No Active or Approved Borrowers Found</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Please approve an application or log an active loan first.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'start' }}>
          
          {/* Left Side: Actions & Delay Penalty Form */}
          <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="no-print">
            
            {/* Actions Card */}
            <div className="card" style={{ margin: 0, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h3 style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Actions</h3>
              <button onClick={printInvoice} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem' }}>
                <Printer size={16} /> Print
              </button>
              <button onClick={() => alert('Downloading PDF Invoice...')} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem' }}>
                <Download size={16} /> Download PDF
              </button>
              <button onClick={handleSendInvoice} disabled={isSending} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem' }}>
                <Send size={16} /> {isSending ? 'Sending...' : 'Send to Borrower'}
              </button>
            </div>

            {/* Delay Penalty Settings Panel */}
            <div className="card" style={{ margin: 0, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Clock size={14} color="var(--color-danger)" /> Overdue &amp; Delay Charges
              </h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  id="overdue-check"
                  type="checkbox"
                  checked={isOverdue}
                  onChange={(e) => setIsOverdue(e.target.checked)}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <label htmlFor="overdue-check" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-primary)', cursor: 'pointer' }}>
                  Repayment Overdue
                </label>
              </div>

              {isOverdue && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '0.65rem' }}>Delay Duration (Days)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={delayDays}
                      onChange={(e) => setDelayDays(Math.max(1, parseInt(e.target.value) || 0))}
                      style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '0.65rem' }}>Daily Penalty Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control"
                      value={penaltyRate}
                      onChange={(e) => setPenaltyRate(Math.max(0, parseFloat(e.target.value) || 0))}
                      style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                    />
                  </div>
                  <div style={{
                    fontSize: '0.7rem',
                    color: 'var(--color-danger-text)',
                    backgroundColor: 'var(--color-danger-bg)',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    fontWeight: '700'
                  }}>
                    Late penalty: +{penaltyAmount.toLocaleString()} MVP
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Invoice Canvas */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <article style={{
              width: '100%',
              maxWidth: '850px',
              backgroundColor: '#ffffff',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
              borderRadius: '8px',
              border: '1px solid var(--border-color-dark)',
              overflow: 'hidden',
              position: 'relative'
            }}>
              
              {/* Overdue Banner */}
              {isOverdue && (
                <div style={{
                  backgroundColor: 'var(--color-danger)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  position: 'relative',
                  zIndex: 20
                }}>
                  <AlertTriangle size={14} /> OVERDUE ALERT: ADDITIONAL LATE PAYMENT SURCHARGES INCURRED.
                </div>
              )}

              {/* Header Banner */}
              <div style={{
                padding: '3rem',
                backgroundColor: '#131b2e',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <Shield size={24} color="var(--color-primary)" />
                    <strong style={{ fontSize: '1.25rem', fontWeight: '900', letterSpacing: '-0.02em' }}>GIIN SENTINEL</strong>
                  </div>
                  <h2 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.03em', margin: 0 }}>INVOICE</h2>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'monospace', display: 'block', marginTop: '0.25rem' }}>
                    Reference: INV-2024-{account.id.split('-')[1] || '001'}
                  </span>
                </div>
                
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>DATE OF ISSUE</span>
                    <strong style={{ fontSize: '1.1rem', color: 'white' }}>{account.loanDate || '2026-07-12'}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>DUE DATE</span>
                    <strong style={{ fontSize: '1.1rem', color: isOverdue ? 'var(--color-danger)' : '#60a5fa' }}>
                      {account.repaymentDate}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Contact Grid */}
              <div style={{
                padding: '3rem',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '3rem',
                borderBottom: '1px solid var(--border-color)'
              }}>
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '700', display: 'block', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>FROM</span>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)', display: 'block', marginBottom: '0.25rem' }}>GIIN Sentinel Institutional Finance</strong>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
                    KG 541 St, Career Center Building<br />
                    Floor 4, Financial District<br />
                    Kigali, Rwanda<br />
                    finance@giinsentinel.com
                  </p>
                </div>
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '700', display: 'block', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>BILL TO</span>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)', display: 'block', marginBottom: '0.25rem' }}>{account.name}</strong>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
                    ID: {account.id}<br />
                    {account.passport || 'National ID'}<br />
                    {account.phone || 'N/A'}<br />
                    {account.email || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Items Table */}
              <div style={{ padding: '3rem 3rem 1.5rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--text-primary)' }}>
                      <th style={{ paddingBottom: '0.75rem', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-primary)' }}>DESCRIPTION</th>
                      <th style={{ paddingBottom: '0.75rem', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-primary)', textAlign: 'center' }}>QTY</th>
                      <th style={{ paddingBottom: '0.75rem', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-primary)', textAlign: 'right' }}>UNIT PRICE (MVP)</th>
                      <th style={{ paddingBottom: '0.75rem', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-primary)', textAlign: 'right' }}>TOTAL (MVP)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1.5rem 0' }}>
                        <strong style={{ fontSize: '0.875rem', color: 'var(--text-primary)', display: 'block' }}>Tuition Loan Principal</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Semester academic installment allocation for {account.type}</span>
                      </td>
                      <td style={{ padding: '1.5rem 0', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>1</td>
                      <td style={{ padding: '1.5rem 0', textAlign: 'right', fontSize: '0.85rem', fontFamily: 'monospace' }}>{account.amount.toLocaleString()}</td>
                      <td style={{ padding: '1.5rem 0', textAlign: 'right', fontSize: '0.85rem', fontWeight: '700', fontFamily: 'monospace' }}>{account.amount.toLocaleString()}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1.5rem 0' }}>
                        <strong style={{ fontSize: '0.875rem', color: 'var(--text-primary)', display: 'block' }}>Administrative Interest</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Institutional service fee calculated at {account.interestRate}</span>
                      </td>
                      <td style={{ padding: '1.5rem 0', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>1</td>
                      <td style={{ padding: '1.5rem 0', textAlign: 'right', fontSize: '0.85rem', fontFamily: 'monospace' }}>{adminInterest.toLocaleString()}</td>
                      <td style={{ padding: '1.5rem 0', textAlign: 'right', fontSize: '0.85rem', fontWeight: '700', fontFamily: 'monospace' }}>{adminInterest.toLocaleString()}</td>
                    </tr>

                    {/* Conditional penalty row */}
                    {isOverdue && (
                      <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(239, 68, 68, 0.02)' }}>
                        <td style={{ padding: '1.5rem 0' }}>
                          <strong style={{ fontSize: '0.875rem', color: 'var(--color-danger-text)', display: 'block' }}>Late Payment Penalty</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-danger-text)' }}>Delay charge for {delayDays} overdue days at {penaltyRate}% per day</span>
                        </td>
                        <td style={{ padding: '1.5rem 0', textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-danger-text)' }}>{delayDays}</td>
                        <td style={{ padding: '1.5rem 0', textAlign: 'right', fontSize: '0.85rem', fontFamily: 'monospace', color: 'var(--color-danger-text)' }}>{Math.round(account.amount * (penaltyRate / 100)).toLocaleString()} / day</td>
                        <td style={{ padding: '1.5rem 0', textAlign: 'right', fontSize: '0.85rem', fontWeight: '700', fontFamily: 'monospace', color: 'var(--color-danger-text)' }}>{penaltyAmount.toLocaleString()}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Bottom section */}
              <div style={{
                padding: '0 3rem 3rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}>
                {/* Collateral details card */}
                <div style={{
                  width: '280px',
                  padding: '1rem',
                  backgroundColor: '#f8fafc',
                  border: '1px solid var(--border-color-dark)',
                  borderRadius: '8px'
                }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                    <BookOpen size={12} /> Collateral Pledge
                  </span>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: '#ffffff',
                      border: '1px solid var(--border-color-dark)',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem'
                    }}>
                      💻
                    </div>
                    <div>
                      <strong style={{ fontSize: '0.75rem', color: 'var(--text-primary)', display: 'block' }}>Verified Security Asset</strong>
                      <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', display: 'block', lineHeight: '1.3' }}>
                        {account.collateralDesc || 'No collateral description.'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Totals */}
                <div style={{ width: '240px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <span>SUBTOTAL</span>
                    <span style={{ fontFamily: 'monospace' }}>{(account.amount + adminInterest).toLocaleString()} MVP</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <span>LATE PENALTY</span>
                    <span style={{ fontFamily: 'monospace', color: isOverdue ? 'var(--color-danger)' : 'inherit' }}>
                      {penaltyAmount.toLocaleString()} MVP
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '2px solid var(--text-primary)',
                    paddingTop: '0.75rem',
                    marginTop: '0.25rem'
                  }}>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>TOTAL DUE</strong>
                    <span style={{ fontSize: '1.5rem', fontWeight: '900', color: isOverdue ? 'var(--color-danger)' : 'var(--color-primary)', fontFamily: 'monospace' }}>
                      {totalDue.toLocaleString()}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right', marginTop: '0.25rem' }}>
                    <span style={{ fontSize: '0.6rem', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', padding: '0.15rem 0.4rem', borderRadius: '4px', fontWeight: '700' }}>
                      MVP CURRENCY
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment instructions bank account */}
              <div style={{
                margin: '0 3rem 3rem',
                padding: '1.25rem',
                backgroundColor: '#f1f5f9',
                borderLeft: '4px solid var(--color-primary)',
                borderRadius: '0 8px 8px 0'
              }}>
                <strong style={{ fontSize: '0.7rem', color: 'var(--text-primary)', display: 'block', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  PAYMENT INSTRUCTIONS
                </strong>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', fontSize: '0.75rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.6rem', display: 'block' }}>BANK NAME</span>
                    <strong style={{ color: 'var(--text-primary)' }}>Bank of Kigali</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.6rem', display: 'block' }}>ACCOUNT NAME</span>
                    <strong style={{ color: 'var(--text-primary)' }}>GIIN Sentinel Finance</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.6rem', display: 'block' }}>ACCOUNT NUMBER</span>
                    <strong style={{ color: 'var(--color-primary)', fontFamily: 'monospace' }}>001-99827-332-01</strong>
                  </div>
                </div>
              </div>

              {/* Signature block */}
              <div style={{
                padding: '2rem 3rem',
                backgroundColor: '#f8fafc',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                  &quot;Enabling future leaders through institutional financial trust.&quot;
                </span>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block' }}>AUTHORIZED BY</span>
                  <div style={{ height: '32px', margin: '0.25rem 0' }}>
                    <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '1.2rem', color: '#64748b', opacity: 0.6 }}>
                      Director of Finance
                    </span>
                  </div>
                  <strong style={{ fontSize: '0.75rem', color: 'var(--text-primary)', display: 'block' }}>GIIN Sentinel Finance</strong>
                </div>
              </div>
            </article>
          </div>
        </div>
      )}
    </div>
  );
}
