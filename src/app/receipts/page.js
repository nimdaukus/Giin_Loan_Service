'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/utils/supabase';
import { Printer, Download, Mail, CheckCircle2, ShieldCheck, Lock, FileText, AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ReceiptPreview() {
  const { loans } = useApp();
  
  // Set initial selection to first completed loan or first loan in list
  const initialLoan = loans.find(l => l.status === 'Completed') || loans[0];
  const [selectedLoanId, setSelectedLoanId] = useState(initialLoan?.id || '');
  const [isSending, setIsSending] = useState(false);

  const loan = loans.find(l => l.id === selectedLoanId);

  const printReceipt = () => {
    window.print();
  };

  const handleSendEmail = () => {
    setIsSending(true);
    setTimeout(async () => {
      setIsSending(false);
      try {
        const newActivity = {
          title: 'Payment Receipt Issued',
          desc: `Receipt RCP-2024-${loan.id.split('-')[1] || '082'} was generated for ${loan.borrowerName} following full settlement of ${loan.id}.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'Receipt',
          userEmail: loan.email,
          ipAddress: 'System'
        };
        await supabase.from('activities').insert(newActivity);
      } catch (err) {
        console.warn("Realtime notification log failed:", err.message);
      }
      alert(`Receipt successfully emailed to ${loan.borrowerName} (${loan.email || 'N/A'}) and dispatched to dashboard.`);
    }, 1200);
  };

  const downloadReceipt = () => {
    if (!loan) return;
    const receiptHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Receipt RCP-2024-${loan.id.split('-')[1] || '082'}</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; background-color: #f8fafc; padding: 2rem; color: #1e293b; }
            .receipt-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #e2e8f0; background: #fff; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); position: relative; }
            .watermark { position: absolute; top: 35%; left: 25%; font-size: 8rem; font-weight: 900; color: rgba(16, 185, 129, 0.04); transform: rotate(-30deg); user-select: none; pointer-events: none; }
            .header { padding-bottom: 1.5rem; border-bottom: 2px solid #1e293b; display: flex; justify-content: space-between; }
            .title { font-size: 1.5rem; font-weight: 800; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 2rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 2rem; }
            .section-title { font-size: 0.7rem; color: #64748b; font-weight: 700; text-transform: uppercase; margin-bottom: 0.5rem; }
            .table { width: 100%; border-collapse: collapse; margin-top: 2rem; text-align: left; }
            .table th { border-bottom: 2px solid #1e293b; padding-bottom: 0.5rem; font-size: 0.75rem; }
            .table td { padding: 1rem 0; border-bottom: 1px solid #e2e8f0; font-size: 0.85rem; }
            .totals { display: flex; justify-content: space-between; margin-top: 2rem; }
            .auth-details { font-size: 0.65rem; color: #64748b; font-family: monospace; line-height: 1.4; }
          </style>
        </head>
        <body>
          <div class="receipt-box">
            <div class="watermark">PAID</div>
            <div class="header">
              <div>
                <div class="title">GIIN SENTINEL RECEIPT</div>
                <div style="font-size: 0.75rem; opacity: 0.8; margin-top: 0.25rem;">NO: RCP-2024-${loan.id.split('-')[1] || '082'}</div>
              </div>
              <div style="text-align: right;">
                <div>DATE ISSUED: <b>${loan.repaymentDate || 'N/A'}</b></div>
                <div style="margin-top: 0.5rem; background-color: #dcfce7; color: #166534; padding: 0.2rem 0.5rem; border-radius: 50px; font-size: 0.65rem; font-weight: 700; display: inline-block;">PAYMENT SUCCESSFUL</div>
              </div>
            </div>
            <div class="grid">
              <div>
                <div class="section-title">BORROWER INFORMATION</div>
                <b>${loan.borrowerName}</b><br>
                ID: ${loan.id}<br>
                Phone: ${loan.phone || 'N/A'}<br>
                Email: ${loan.email || 'N/A'}
              </div>
              <div>
                <div class="section-title">TRANSACTION SUMMARY</div>
                Method: <b>Bank Settlement</b><br>
                Reference: <b>TXN-${(loan.contractId || 'bk-node').slice(-8).toUpperCase()}</b><br>
                Invoice Ref: <b>INV-2024-${loan.id.split('-')[1] || '001'}</b>
              </div>
            </div>
            <table class="table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th style="text-align: right;">Amount (MVP)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><b>Principal Repayment</b><br><span style="color: #64748b; font-size: 0.75rem;">Full repayment for ${loan.type}</span></td>
                  <td style="text-align: right; font-family: monospace;">${loan.amount.toLocaleString()}</td>
                </tr>
                <tr>
                  <td><b>Accrued Interest</b><br><span style="color: #64748b; font-size: 0.75rem;">Cycle Rate ${loan.interestRate}</span></td>
                  <td style="text-align: right; font-family: monospace;">${(loan.interestAmount || 0).toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
            <div class="totals">
              <div class="auth-details">
                Auth Hash: ${loan.contractId || 'N/A'}<br>
                Node Verifier: Sentinel-BK-02<br>
                Timestamp: ${new Date().toISOString().split('T')[0]}T14:22:01Z
              </div>
              <div style="width: 250px; text-align: right;">
                <div style="font-size: 1.25rem; font-weight: 900; color: #10b981;">TOTAL PAID: ${(loan.amount + (loan.interestAmount || 0)).toLocaleString()} MVP</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
    const blob = new Blob([receiptHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Receipt_RCP-2024-${loan.id.split('-')[1] || '082'}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Selector and Actions row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }} className="no-print">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Receipt Settlement Center</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Generate and dispatch official payment receipts for active ledger clients.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Select Borrower:</label>
          <select
            value={selectedLoanId}
            onChange={(e) => setSelectedLoanId(e.target.value)}
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
            {loans.map(l => (
              <option key={l.id} value={l.id}>
                {l.borrowerName} ({l.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {!loan ? (
        <div style={{ textAlign: 'center', padding: '4rem' }} className="card">
          <AlertTriangle size={48} color="var(--color-danger)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>No Loan Records Found</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Please create a loan inside the Main Tracker first.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'start' }}>
          {/* Left Side: Actions */}
          <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="no-print">
            <div className="card" style={{ margin: 0, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h3 style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Management Actions</h3>
              
              <button 
                onClick={printReceipt} 
                disabled={loan.status !== 'Completed'}
                className="btn btn-primary" 
                style={{ display: 'flex', justifyCenter: 'center', gap: '0.5rem', width: '100%', justifyContent: 'center', opacity: loan.status !== 'Completed' ? 0.5 : 1 }}
              >
                <Printer size={16} /> Print Receipt
              </button>
              
              <button 
                onClick={downloadReceipt} 
                disabled={loan.status !== 'Completed'}
                className="btn btn-outline" 
                style={{ display: 'flex', justifyCenter: 'center', gap: '0.5rem', width: '100%', justifyContent: 'center', opacity: loan.status !== 'Completed' ? 0.5 : 1 }}
              >
                <Download size={16} /> Download PDF (HTML Format)
              </button>
              
              <button 
                onClick={handleSendEmail} 
                disabled={loan.status !== 'Completed' || isSending}
                className="btn btn-outline" 
                style={{ display: 'flex', justifyCenter: 'center', gap: '0.5rem', width: '100%', justifyContent: 'center', opacity: loan.status !== 'Completed' ? 0.5 : 1 }}
              >
                <Mail size={16} /> {isSending ? 'Sending...' : 'Email to Borrower'}
              </button>
            </div>

            <div style={{
              backgroundColor: loan.status === 'Completed' ? '#f0fdf4' : '#fffbeb',
              color: loan.status === 'Completed' ? '#14532d' : '#78350f',
              borderRadius: '8px',
              padding: '1.25rem',
              border: loan.status === 'Completed' ? '1px solid #bbf7d0' : '1px solid #fef3c7'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: '700', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                {loan.status === 'Completed' ? <CheckCircle2 size={14} color="#166534" /> : <AlertTriangle size={14} color="#854d0e" />}
                <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {loan.status === 'Completed' ? 'Settled Ledger' : 'Active Account'}
                </span>
              </div>
              <p style={{ fontSize: '0.7rem', opacity: 0.9, lineHeight: '1.5', margin: 0 }}>
                {loan.status === 'Completed' 
                  ? 'This receipt represents an immutable proof of settlement. Recorded on the private GIIN credit ledger.' 
                  : `This borrower has an outstanding balance of ${loan.balance.toLocaleString()} MVP. Receipts are issued automatically upon final payment.`}
              </p>
            </div>
          </div>

          {/* Right Side: Receipt Canvas / Locked view */}
          <div style={{ flex: 1 }}>
            {loan.status !== 'Completed' ? (
              /* Locked Placeholder screen */
              <div className="card" style={{
                margin: 0,
                padding: '4rem 2rem',
                textAlign: 'center',
                backgroundColor: '#ffffff',
                border: '1.5px dashed var(--border-color-dark)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.25rem'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-warning-bg)',
                  color: 'var(--color-warning-text)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Lock size={30} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>Receipt Generation Locked</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0.5rem auto 0', lineHeight: '1.5' }}>
                    Receipts are only generated for borrowers who have fully cleared their repayments. <strong>{loan.borrowerName}</strong> has a remaining balance of <strong>{loan.balance.toLocaleString()} MVP</strong>.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <Link href="/main-tracker" className="btn btn-primary" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    Go to Main Tracker <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ) : (
              /* Receipt Canvas */
              <div style={{
                backgroundColor: '#ffffff',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
                border: '1px solid var(--border-color-dark)',
                borderRadius: '4px',
                padding: '3.5rem',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '800px'
              }}>
                {/* PAID Watermark */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10rem',
                  fontWeight: '900',
                  color: 'rgba(16, 185, 129, 0.05)',
                  transform: 'rotate(-30deg)',
                  userSelect: 'none',
                  pointerEvents: 'none',
                  zIndex: 1
                }}>
                  PAID
                </div>

                <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', height: '100%', minHeight: '700px' }}>
                  {/* Header */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    borderBottom: '2px solid var(--text-primary)',
                    paddingBottom: '1.5rem',
                    marginBottom: '2rem'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.5rem' }}>
                        <ShieldCheck size={20} color="var(--color-primary)" />
                        <strong style={{ fontSize: '1.1rem', fontWeight: '800', letterSpacing: '-0.02em' }}>GIIN SENTINEL</strong>
                      </div>
                      <h2 style={{ fontSize: '1.75rem', fontWeight: '900', margin: 0 }}>PAYMENT RECEIPT</h2>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'monospace', display: 'block', marginTop: '0.25rem' }}>
                        NO: RCP-2024-{loan.id.split('-')[1] || '082'}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Date Issued</span>
                      <strong style={{ fontSize: '1.1rem', color: 'var(--text-primary)', display: 'block' }}>{loan.repaymentDate}</strong>
                      <span style={{
                        display: 'inline-block',
                        backgroundColor: 'var(--color-success-bg)',
                        color: 'var(--color-success)',
                        fontSize: '0.65rem',
                        fontWeight: '700',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '50px',
                        marginTop: '0.5rem'
                      }}>
                        PAYMENT SUCCESSFUL
                      </span>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '2.5rem',
                    marginBottom: '2.5rem'
                  }}>
                    <div>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '700', borderBottom: '1px solid var(--border-color)', display: 'block', paddingBottom: '0.25rem', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                        Borrower Information
                      </span>
                      <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{loan.borrowerName}</strong>
                        <span style={{ color: 'var(--text-secondary)' }}>ID: {loan.id}</span>
                        <span style={{ color: 'var(--text-secondary)' }}>{loan.email || 'N/A'}</span>
                        <span style={{ color: 'var(--text-secondary)' }}>{loan.phone || 'N/A'}</span>
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '700', borderBottom: '1px solid var(--border-color)', display: 'block', paddingBottom: '0.25rem', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                        Transaction Summary
                      </span>
                      <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Payment Method</span>
                          <strong style={{ color: 'var(--text-primary)' }}>Bank Settlement</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Reference No.</span>
                          <strong style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>TXN-{loan.contractId.slice(-8).toUpperCase()}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Invoice Ref.</span>
                          <strong style={{ color: 'var(--color-primary)' }}>INV-2024-{loan.id.split('-')[1] || '001'}</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Financial Table */}
                  <div style={{ marginBottom: '2.5rem' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f8fafc', borderY: '1px solid var(--border-color)' }}>
                          <th style={{ padding: '0.75rem 1rem', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-primary)' }}>Description</th>
                          <th style={{ padding: '0.75rem 1rem', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-primary)', textAlign: 'right' }}>Amount (MVP)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '1rem' }}>
                            <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)', display: 'block' }}>Principal Repayment</strong>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Full payout for {loan.type}</span>
                          </td>
                          <td style={{ padding: '1rem', textAlign: 'right', fontSize: '0.85rem', fontFamily: 'monospace' }}>{loan.amount.toLocaleString()}</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '1rem' }}>
                            <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)', display: 'block' }}>Accrued Interest</strong>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Cycle Rate {loan.interestRate}</span>
                          </td>
                          <td style={{ padding: '1rem', textAlign: 'right', fontSize: '0.85rem', fontFamily: 'monospace' }}>{(loan.interestAmount || 0).toLocaleString()}</td>
                        </tr>
                        <tr style={{ borderTop: '2px solid var(--text-primary)' }}>
                          <td style={{ padding: '1.25rem 1rem' }}>
                            <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>Total Amount Paid</strong>
                          </td>
                          <td style={{ padding: '1.25rem 1rem', textAlign: 'right' }}>
                            <span style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--color-primary)', fontFamily: 'monospace' }}>{(loan.amount + (loan.interestAmount || 0)).toLocaleString()} MVP</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Sign off and verification */}
                  <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', alignItems: 'end' }}>
                      <div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: '0 0 1rem' }}>
                          Thank you for your prompt repayment. Consistent on-time payments contribute positively to your institutional credit score and future borrowing eligibility.
                        </p>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            border: '1.5px solid #cbd5e1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#64748b'
                          }}>
                            🛡️
                          </div>
                          <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', fontFamily: 'monospace', lineHeight: '1.3' }}>
                            Auth Hash: {loan.contractId}<br />
                            Node Verifier: Sentinel-BK-02<br />
                            Timestamp: {new Date().toISOString().split('T')[0]}T14:22:01Z
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '0.25rem', marginBottom: '0.5rem', display: 'inline-block' }}>
                          <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '1.2rem', color: '#64748b', opacity: 0.6 }}>
                            Director of Finance
                          </span>
                        </div>
                        <strong style={{ fontSize: '0.75rem', color: 'var(--text-primary)', display: 'block' }}>Director of Finance</strong>
                        <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>GIIN Sentinel Financial Services</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom decorative color border bar */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(to right, var(--color-primary), var(--color-success), var(--color-primary))'
                }}></div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
