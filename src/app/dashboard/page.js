'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { DollarSign, Percent, TrendingUp, AlertCircle, FileText, CheckCircle, XCircle, ArrowUpRight, TrendingDown, Bell } from 'lucide-react';

export default function Dashboard() {
  const { loans, applications, activities, sendReminder, t, formatCurrency } = useApp();
  const [chartMetric, setChartMetric] = useState('VOLUME'); // 'VOLUME' | 'REPAYMENT'
  
  // Track reminder triggers locally for button success state
  const [localTriggered, setLocalTriggered] = useState({});

  const handleTriggerReminder = (loanId, name) => {
    sendReminder(loanId);
    setLocalTriggered(prev => ({ ...prev, [loanId]: true }));
    alert(`Institutional reminder successfully dispatched to ${name}.`);
  };

  // Derive dynamic analytics while preserving baseline portfolio scale
  const activeLoansVal = loans.reduce((sum, l) => sum + (l.status === 'Active' ? l.balance : 0), 0);
  const accruedInterestVal = loans.reduce((sum, l) => sum + (l.interestAmount || 0), 0);
  
  // Baseline portfolio constant references:
  // Pre-populated active values sum to 175k principal, 17.1k interest.
  const dynamicOutstanding = 12482900 + (activeLoansVal - 175000);
  const dynamicInterest = 842500 + (accruedInterestVal - 22885);
  const dynamicTotalRepayment = dynamicOutstanding + dynamicInterest;
  const pendingCount = applications.filter(a => a.status === 'Pending' || a.status === 'Under Review').length;

  // Filter top overdue / close due date loans for action required section
  const actionRequiredLoans = loans
    .filter(l => l.status === 'Active')
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 2);

  return (
    <div>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>{t('oversight')}</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          Sentinel platform monitoring for active capital flows.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="metric-cards-container">
        {/* Total Outstanding Principal */}
        <div className="metric-card">
          <div className="metric-card-header">
            <span className="metric-card-title" style={{ fontSize: '0.75rem' }}>{t('outstanding')}</span>
            <div style={{ backgroundColor: '#eff6ff', padding: '0.375rem', borderRadius: '50%' }}>
              <DollarSign size={16} color="var(--color-primary)" />
            </div>
          </div>
          <div className="metric-value">{formatCurrency(dynamicOutstanding)}</div>
          <div className="metric-change up" style={{ fontSize: '0.7rem' }}>
            <TrendingUp size={12} />
            <span>+8.4% vs last month</span>
          </div>
        </div>

        {/* Expected Interest */}
        <div className="metric-card">
          <div className="metric-card-header">
            <span className="metric-card-title" style={{ fontSize: '0.75rem' }}>{t('expectedInterest')}</span>
            <div style={{ backgroundColor: '#eff6ff', padding: '0.375rem', borderRadius: '50%' }}>
              <Percent size={16} color="var(--color-primary)" />
            </div>
          </div>
          <div className="metric-value">{formatCurrency(dynamicInterest)}</div>
          <div className="metric-change up" style={{ fontSize: '0.7rem' }}>
            <TrendingUp size={12} />
            <span>+2.1% accrued month-to-date</span>
          </div>
        </div>

        {/* Total Repayment Expected */}
        <div className="metric-card">
          <div className="metric-card-header">
            <span className="metric-card-title" style={{ fontSize: '0.75rem' }}>{t('expectedRepayment')}</span>
            <div style={{ backgroundColor: '#fee2e2', padding: '0.375rem', borderRadius: '50%' }}>
              <DollarSign size={16} color="var(--color-danger)" />
            </div>
          </div>
          <div className="metric-value">{formatCurrency(dynamicTotalRepayment)}</div>
          <div className="metric-change down" style={{ fontSize: '0.7rem', backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger-text)' }}>
            <TrendingDown size={12} />
            <span>-1.2% projected for Q4 closure</span>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="metric-card">
          <div className="metric-card-header">
            <span className="metric-card-title" style={{ fontSize: '0.75rem' }}>{t('pendingApprovals')}</span>
            <div style={{ backgroundColor: '#fef3c7', padding: '0.375rem', borderRadius: '50%' }}>
              <AlertCircle size={16} color="var(--color-warning)" />
            </div>
          </div>
          <div className="metric-value">{pendingCount}</div>
          <div className="metric-change down" style={{ fontSize: '0.7rem', backgroundColor: pendingCount > 0 ? 'var(--color-warning-bg)' : 'var(--color-success-bg)', color: pendingCount > 0 ? 'var(--color-warning-text)' : 'var(--color-success)' }}>
            <span>{pendingCount > 0 ? 'ACTION REQUIRED' : 'ALL CAUGHT UP'}</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Left Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Monthly Performance Chart Card */}
          <div className="card" style={{ marginBottom: 0 }}>
            <div className="card-header">
              <div>
                <h3 className="card-title">Monthly Performance</h3>
                <span className="card-subtitle">Loan volume and repayment trends</span>
              </div>
              
              {/* Toggles */}
              <div style={{ display: 'flex', gap: '0.5rem', border: '1px solid var(--border-color-dark)', padding: '2px', borderRadius: '6px' }}>
                <button
                  onClick={() => setChartMetric('VOLUME')}
                  className={`btn btn-small ${chartMetric === 'VOLUME' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ border: 'none', padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}
                >
                  VOLUME
                </button>
                <button
                  onClick={() => setChartMetric('REPAYMENT')}
                  className={`btn btn-small ${chartMetric === 'REPAYMENT' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ border: 'none', padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}
                >
                  REPAYMENT
                </button>
              </div>
            </div>

            {/* Custom Bar Chart Simulation */}
            <div className="chart-sim-container">
              {[
                { month: 'JAN', volume: 40, repayment: 65 },
                { month: 'FEB', volume: 55, repayment: 45 },
                { month: 'MAR', volume: 90, repayment: 55 },
                { month: 'APR', volume: 65, repayment: 80 },
                { month: 'MAY', volume: 75, repayment: 60 },
                { month: 'JUN', volume: 45, repayment: 70 }
              ].map((data, idx) => (
                <div key={idx} className="chart-bar-group">
                  <div className="chart-bars">
                    <div
                      className="chart-bar repayments"
                      style={{
                        height: `${chartMetric === 'VOLUME' ? data.volume * 0.7 : data.repayment * 0.5}%`,
                        backgroundColor: chartMetric === 'VOLUME' ? '#93c5fd' : 'var(--color-primary)'
                      }}
                    ></div>
                    <div
                      className="chart-bar loans"
                      style={{
                        height: `${chartMetric === 'VOLUME' ? data.volume * 0.9 : data.repayment * 0.9}%`,
                        backgroundColor: chartMetric === 'VOLUME' ? 'var(--color-primary)' : '#93c5fd'
                      }}
                    ></div>
                  </div>
                  <div className="chart-label">{data.month}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Portfolio Status Table */}
          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Portfolio Status Overview</h3>
                <span className="card-subtitle">Dynamic audit of active disbursements</span>
              </div>
              <Link href="/main-tracker" style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-primary)', textDecoration: 'none' }}>
                VIEW MAIN TRACKER →
              </Link>
            </div>

            <div className="table-wrapper">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Loan ID</th>
                    <th>Borrower</th>
                    <th>Borrowed Principal</th>
                    <th>Due Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loans.map((row) => (
                    <tr key={row.id}>
                      <td style={{ fontWeight: '700', color: 'var(--text-secondary)' }}>{row.id}</td>
                      <td style={{ fontWeight: '700' }}>{row.borrowerName}</td>
                      <td style={{ fontWeight: '700' }}>{row.amount.toLocaleString()} MVP</td>
                      <td>{row.repaymentDate}</td>
                      <td>
                        <span className={`badge ${
                          row.status === 'Completed' ? 'success' : 'warning'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Live Activity */}
          <div className="card" style={{ marginBottom: 0 }}>
            <div className="card-header">
              <h3 className="card-title">Live Activity</h3>
            </div>
            <div className="activity-list">
              {activities.slice(0, 5).map((act) => (
                <div key={act.id} className="activity-item">
                  <div className="activity-icon-wrapper" style={{
                    backgroundColor: act.type === 'submit' ? '#eff6ff' : act.type === 'repayment' ? '#d1fae5' : '#fee2e2'
                  }}>
                    {act.type === 'submit' ? <FileText size={14} color="var(--color-primary)" /> :
                     act.type === 'repayment' ? <CheckCircle size={14} color="var(--color-success)" /> :
                     <XCircle size={14} color="var(--color-danger)" />}
                  </div>
                  <div className="activity-content">
                    <div className="activity-title" style={{ fontSize: '0.85rem' }}>{act.title}</div>
                    <div className="activity-desc" style={{ fontSize: '0.75rem' }}>{act.desc}</div>
                    <div className="activity-time" style={{ fontSize: '0.65rem' }}>{act.time}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <Link href="/security" className="btn btn-outline btn-small" style={{ width: '100%', marginTop: '1.25rem', justifyContent: 'center' }}>
              VIEW ALL AUDITS
            </Link>
          </div>

          {/* Action Required */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Repayments Attention</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {actionRequiredLoans.map((loan) => {
                const isOverdue = loan.daysLeft <= 0;
                const hasSent = loan.reminderStatus === 'Sent';
                return (
                  <div key={loan.id} style={{
                    padding: '1rem',
                    backgroundColor: '#f8fafc',
                    border: '1px solid var(--border-color-dark)',
                    borderRadius: 'var(--radius-md)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '0.875rem' }}>{loan.borrowerName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>
                          Balance: <strong style={{ color: 'var(--text-primary)' }}>{loan.balance.toLocaleString()} MVP</strong>
                        </div>
                      </div>
                      <span className={`badge ${isOverdue ? 'danger' : 'warning'}`} style={{ fontSize: '0.6rem', padding: '0.1rem 0.3rem' }}>
                        {isOverdue ? 'OVERDUE' : `${loan.daysLeft} DAYS LEFT`}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => handleTriggerReminder(loan.id, loan.borrowerName)}
                      disabled={hasSent}
                      className={`btn btn-small ${hasSent ? 'btn-outline' : 'btn-primary'}`}
                      style={{ width: '100%', marginTop: '0.75rem', fontSize: '0.75rem', height: '32px' }}
                    >
                      {hasSent ? 'SENT ✓' : 'SEND REMINDER'}
                    </button>
                  </div>
                );
              })}

              {actionRequiredLoans.length === 0 && (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem 0' }}>
                  No outstanding active accounts require attention.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
