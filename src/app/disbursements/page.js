'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Landmark, ArrowUpRight, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

export default function Disbursements() {
  const { momoStatus, setMomoStatus, loans, formatCurrency } = useApp();

  const handleAuthorize = () => {
    setMomoStatus('Confirmed');
    alert('MoMo disbursement authorized! Transaction settled on block nodes.');
  };

  const handleReject = () => {
    setMomoStatus('Rejected');
    alert('MoMo disbursement rejected. Settlement cancelled.');
  };

  const isPending = momoStatus === 'Pending';
  const isConfirmed = momoStatus === 'Confirmed';
  const isRejected = momoStatus === 'Rejected';

  // Calculate metrics dynamically from database loans
  const totalSettlements = loans.filter(l => l.status === 'Completed').length;
  const pendingCount = loans.filter(l => l.status === 'Active' || l.status === 'Under Review').length;
  const totalSettledValue = loans.reduce((sum, l) => sum + (l.status === 'Completed' ? l.amount : 0), 0);

  return (
    <div>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Disbursements Workflow</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          Track external settlements and Mobile Money (MoMo) disbursement states.
        </p>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1.25rem',
        marginTop: '2rem',
        marginBottom: '2rem'
      }}>
        <div className="card" style={{ margin: 0, padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Settlements</span>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '0.25rem' }}>{totalSettlements}</div>
            </div>
            <div style={{ backgroundColor: 'var(--color-primary-light)', padding: '0.375rem', borderRadius: '50%' }}>
              <Landmark size={16} color="var(--color-primary)" />
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem', fontWeight: '600' }}>
            Institutional disbursements cleared
          </div>
        </div>

        <div className="card" style={{ margin: 0, padding: '1.25rem', borderLeft: isPending ? '4px solid var(--color-warning)' : 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pending Verification</span>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: isPending ? 'var(--color-warning-text)' : 'var(--text-primary)', marginTop: '0.25rem' }}>
                {pendingCount + (isPending ? 1 : 0)}
              </div>
            </div>
            <div style={{ backgroundColor: isPending ? 'var(--color-warning-bg)' : '#f1f5f9', padding: '0.375rem', borderRadius: '50%' }}>
              <AlertCircle size={16} color={isPending ? 'var(--color-warning)' : '#64748b'} />
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem', fontWeight: '600' }}>
            {isPending ? 'MTN MoMo Settlement Awaiting approval' : 'All clear'}
          </div>
        </div>

        <div className="card" style={{ margin: 0, padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Settled Value</span>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-success)', marginTop: '0.25rem' }}>
                {formatCurrency(totalSettledValue + (isConfirmed ? 1450000 : 0))}
              </div>
            </div>
            <div style={{ backgroundColor: 'var(--color-success-bg)', padding: '0.375rem', borderRadius: '50%' }}>
              <CheckCircle2 size={16} color="var(--color-success)" />
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem', fontWeight: '600' }}>
            Clearance account volume index
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="card" style={{ padding: 0 }}>
        <div className="card-header" style={{ padding: '1.25rem' }}>
          <div>
            <h3 className="card-title">Disbursements Ledger</h3>
            <span className="card-subtitle">Active capital allocation events</span>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Recipient</th>
                <th>Payment Route</th>
                <th>Value</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* MoMo Entry */}
              {isPending && (
                <tr>
                  <td style={{ fontWeight: '700', color: 'var(--text-secondary)' }}>TXN-882-SNTNL-012</td>
                  <td style={{ fontWeight: '700' }}>Jean-Claude Bizimana</td>
                  <td>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', fontWeight: '500' }}>
                      Equity Bank → MTN MoMo
                    </span>
                  </td>
                  <td style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                    RWF 1,450,000
                  </td>
                  <td>
                    <span className="badge warning" style={{ fontSize: '0.65rem' }}>
                      Verification Awaited
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={handleAuthorize} className="btn btn-primary btn-small" style={{ height: '28px', padding: '0.25rem 0.5rem' }}>
                        Authorize
                      </button>
                      <button onClick={handleReject} className="btn btn-danger-outline btn-small" style={{ height: '28px', padding: '0.25rem 0.5rem' }}>
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {/* Dynamic Live Entries from database */}
              {loans.map((loan) => (
                <tr key={loan.id}>
                  <td style={{ fontWeight: '700', color: 'var(--text-secondary)' }}>{loan.contractId || `TXN-${loan.id.split('-').pop()}`}</td>
                  <td style={{ fontWeight: '700' }}>{loan.borrowerName}</td>
                  <td>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', fontWeight: '500' }}>
                      GIIN Node Routing
                    </span>
                  </td>
                  <td style={{ fontWeight: '700' }}>{formatCurrency(loan.amount)}</td>
                  <td>
                    <span className={`badge ${loan.status === 'Completed' ? 'success' : 'warning'}`} style={{ fontSize: '0.65rem' }}>
                      {loan.status}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                      {loan.status === 'Completed' ? 'Cleared ✓' : 'Outstanding'}
                    </span>
                  </td>
                </tr>
              ))}

              {loans.length === 0 && !isPending && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                    No active disbursements logged on the network ledger.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
