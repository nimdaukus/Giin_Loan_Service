'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Mail, Phone, Edit, Send, CheckSquare, RefreshCw, Smartphone, Check, AlertCircle, AlertTriangle } from 'lucide-react';

export default function RemindersCenter() {
  const { loans, templates, updateTemplate, sendReminder } = useApp();
  
  // Dynamically filter active unpaid loans
  const unpaidLoans = loans.filter(loan => loan.status === 'Active');
  const dispatchedCount = loans.filter(loan => loan.reminderStatus === 'Sent').length;

  // Selected template state
  const activeTemplate = templates[0];
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  
  // Selected borrower for preview mockup
  const [previewLoanId, setPreviewLoanId] = useState(unpaidLoans[0]?.id || '');

  // Sync state with template on load
  useEffect(() => {
    if (activeTemplate) {
      setSubject(activeTemplate.subject);
      setBody(activeTemplate.body);
    }
  }, [activeTemplate]);

  // Find preview borrower details
  const previewLoan = unpaidLoans.find(l => l.id === previewLoanId) || unpaidLoans[0];

  // Compile template for preview dynamically
  const compiledSubject = previewLoan && subject
    ? subject.replace('[LOAN_ID]', previewLoan.id)
    : 'No active loans to preview';
  
  const compiledBody = previewLoan && body
    ? body
        .replace('[BORROWER_NAME]', previewLoan.borrowerName)
        .replace('[REPAYMENT_AMOUNT]', `${previewLoan.amount.toLocaleString()} MVP`)
        .replace('[LOAN_TYPE]', previewLoan.type)
        .replace('[DAYS_LEFT]', previewLoan.daysLeft.toString())
        .replace('[DUE_DATE]', previewLoan.repaymentDate)
        .replace('[LOAN_ID]', previewLoan.id)
    : 'There are currently no outstanding loans in the ledger. Reminders are fully cleared.';

  const handleSave = () => {
    updateTemplate(activeTemplate.id, subject, body);
    alert('Template saved successfully!');
  };

  const handleSendTest = () => {
    alert(`Test email sent to advisor inbox with subject: "${compiledSubject}"`);
  };

  return (
    <div>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Reminders Center</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          Automate and dispatch repayment alerts for active unpaid borrowers.
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
        <div className="card" style={{ margin: 0, borderLeft: '4px solid var(--color-danger)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }}>ACTIVE UNPAID LOANS</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', marginTop: '0.25rem' }}>{unpaidLoans.length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-danger)', fontWeight: '600', marginTop: '0.25rem' }}>
            Requires repayment follow-up
          </div>
        </div>
        <div className="card" style={{ margin: 0, borderLeft: '4px solid var(--color-warning)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }}>DISPATCHED TODAY</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', marginTop: '0.25rem' }}>{dispatchedCount}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-warning)', fontWeight: '600', marginTop: '0.25rem' }}>
            Triggered reminder notifications
          </div>
        </div>
        <div className="card" style={{ margin: 0, borderLeft: '4px solid var(--color-success)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }}>DELIVERY SLA</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', marginTop: '0.25rem' }}>100.0%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: '600', marginTop: '0.25rem' }}>
            Secure node messaging active
          </div>
        </div>
      </div>

      {/* Top Section: Active Reminders Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Active Repayment Tracking</h3>
            <span className="card-subtitle">Scheduled triggers and dispatch logs</span>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Borrower</th>
                <th>Due Date</th>
                <th>Days Remaining</th>
                <th>Phone Number</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {unpaidLoans.map((rem) => (
                <tr key={rem.id}>
                  <td style={{ fontWeight: '700' }}>{rem.borrowerName}</td>
                  <td>{rem.repaymentDate}</td>
                  <td style={{ fontWeight: '600', color: rem.daysLeft <= 15 ? 'var(--color-danger)' : 'var(--text-primary)' }}>
                    {rem.daysLeft} Days
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {rem.phone || 'N/A'}
                  </td>
                  <td>
                    <span className={`badge ${
                      rem.reminderStatus === 'Sent' ? 'success' : 'warning'
                    }`}>
                      {rem.reminderStatus || 'Pending'}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => sendReminder(rem.id)}
                      disabled={rem.reminderStatus === 'Sent'}
                      className={`btn btn-small ${rem.reminderStatus === 'Sent' ? 'btn-outline' : 'btn-primary'}`}
                      style={{ padding: '0.25rem 0.5rem', height: '28px' }}
                    >
                      {rem.reminderStatus === 'Sent' ? <Check size={12} /> : <Send size={12} />}
                      <span>{rem.reminderStatus === 'Sent' ? 'Dispatched' : 'Send Now'}</span>
                    </button>
                  </td>
                </tr>
              ))}

              {unpaidLoans.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                    <CheckCircle2 size={24} color="var(--color-success)" style={{ display: 'inline-block', marginBottom: '0.5rem' }} /><br />
                    All borrowers have fully settled their loans. No reminders pending!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Section: Editor & Preview */}
      <div className="card">
        <div className="card-header" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 className="card-title">Alert Customization</h3>
            <span className="card-subtitle">Edit reminder scripts and preview dynamic outputs</span>
          </div>
          
          {/* Dropdown to pick active borrower for live device mockup */}
          {unpaidLoans.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Preview Client:</span>
              <select 
                value={previewLoanId}
                onChange={(e) => setPreviewLoanId(e.target.value)}
                style={{
                  border: '1px solid var(--border-color-dark)',
                  padding: '0.375rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  backgroundColor: 'white',
                  outline: 'none'
                }}
              >
                {unpaidLoans.map(l => (
                  <option key={l.id} value={l.id}>{l.borrowerName}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="template-editor-grid">
          {/* Form Editor */}
          <div>
            <div className="form-group">
              <label>Subject Line</label>
              <input
                type="text"
                className="form-control"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter email subject line"
              />
            </div>
            
            <div className="form-group">
              <label>Body Content</label>
              <textarea
                className="form-control"
                rows="8"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Type reminder email content here..."
                style={{ resize: 'none', lineHeight: '1.6' }}
              />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.5rem' }}>
                Use placeholders: <code>[BORROWER_NAME]</code>, <code>[REPAYMENT_AMOUNT]</code>, <code>[LOAN_TYPE]</code>, <code>[DAYS_LEFT]</code>, <code>[DUE_DATE]</code>, <code>[LOAN_ID]</code>
              </span>
            </div>

            <div style={{
              display: 'flex',
              gap: '1rem',
              marginTop: '1.5rem',
              borderTop: '1px solid var(--border-color)',
              paddingTop: '1rem'
            }}>
              <button onClick={handleSave} className="btn btn-primary">
                <CheckSquare size={16} /> Save Changes
              </button>
              <button onClick={handleSendTest} className="btn btn-outline">
                <Send size={16} /> Send Test Email
              </button>
            </div>
          </div>

          {/* Device Preview Mockup */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Smartphone size={14} /> Live Client View
            </div>

            <div className="email-mockup-wrapper">
              <div className="email-mockup-header">
                Subject: {compiledSubject}
              </div>
              <div className="email-mockup-content">
                <div className="email-logo-section">
                  🛡️ GIIN SENTINEL
                </div>
                <div className="email-body-text">
                  {compiledBody}
                </div>
                <div style={{
                  marginTop: 'auto',
                  backgroundColor: 'var(--color-primary)',
                  color: 'white',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  textAlign: 'center',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                  View Payment Portal
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
