'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { User, Smartphone, CreditCard, Clipboard, ShieldCheck, HelpCircle, Send, CheckCircle, FileText, Landmark, Upload, Eye, EyeOff, Edit, ShieldAlert, Check } from 'lucide-react';

export default function MobileApp() {
  const { loans, submitApplication, makePayment, momoStatus, setMomoStatus } = useApp();
  
  // Navigation tabs in simulator
  const [activeTab, setActiveTab] = useState('apply'); // 'apply' | 'my-loans' | 'profile'
  const [showNationalId, setShowNationalId] = useState(false);
  
  // Apply Screen multi-step form states
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({
    name: 'Jean Paul H.',
    phone: '+1 647 889 0123',
    passport: 'A123456789',
    email: 'jean.paul.h@example.com',
    address: '572 West Rd, Toronto',
    amount: '500000',
    term: '1-week',
    type: 'Business Expansion Loan',
    collateralDesc: 'Warehouse lease contract and heavy machinery ownership papers.'
  });

  const [uploads, setUploads] = useState({
    passportPhoto: true,
    propertyProof: true,
    bankStatement: false
  });

  // Find active loans in state
  const activeLoans = loans.filter(loan => loan.status === 'Active');
  const completedLoans = loans.filter(loan => loan.status === 'Completed');

  // Handle form navigation
  const nextStep = () => {
    if (formStep < 3) setFormStep(formStep + 1);
  };

  const prevStep = () => {
    if (formStep > 1) setFormStep(formStep - 1);
  };

  // Handle application submission
  const handleSubmit = (e) => {
    e.preventDefault();
    submitApplication(formData);
    alert('Loan Application Submitted successfully! Go to the Approval Center page on the dashboard to review and approve it.');
    
    // Reset Form
    setFormStep(1);
    setFormData({
      name: '',
      phone: '',
      passport: '',
      email: '',
      address: '',
      amount: '',
      term: '1 Week',
      type: 'Business Expansion Loan',
      collateralDesc: ''
    });
    setUploads({
      passportPhoto: false,
      propertyProof: false,
      bankStatement: false
    });
    
    // Auto switch tab to view active loans
    setActiveTab('my-loans');
  };

  // Handle payment triggers
  const handlePayment = (loanId, amount) => {
    makePayment(loanId, amount);
    alert(`Payment of ${amount.toLocaleString()} MVP processed successfully! Metrics updated across the dashboard.`);
  };

  return (
    <div>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Mobile App Simulator</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          Interact with the client-facing loan application portal. Submitting or paying here live-syncs with the advisor dashboard.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.5fr',
        gap: '2.5rem',
        marginTop: '2.5rem',
        alignItems: 'start'
      }}>
        {/* Left Column: Device Mockup Frame */}
        <div className="device-container">
          <div className="device-frame">
            <div className="device-notch">
              <div className="device-notch-camera"></div>
            </div>

            <div className="device-screen">
              {/* Simulator Header */}
              <div className="device-header">
                <span className="device-app-title">
                  🛡️ GIIN Sentinel
                </span>
                <span style={{ fontSize: '0.65rem', padding: '0.125rem 0.375rem', backgroundColor: '#e2e8f0', borderRadius: '4px', fontWeight: '600' }}>
                  BETA CLIENT
                </span>
              </div>

              {/* Simulator Body */}
              <div className="device-body">
                
                {/* 1. APPLY TAB */}
                {activeTab === 'apply' && (
                  <div>
                    <h2 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '0.25rem' }}>Loan Application</h2>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                      Submit official files for institutional verification.
                    </p>

                    {/* Step bar */}
                    <div className="steps-indicator">
                      <div className={`step-node ${formStep >= 1 ? 'active' : ''} ${formStep > 1 ? 'completed' : ''}`}>
                        {formStep > 1 ? '✓' : '1'}
                      </div>
                      <div className={`step-node ${formStep >= 2 ? 'active' : ''} ${formStep > 2 ? 'completed' : ''}`}>
                        {formStep > 2 ? '✓' : '2'}
                      </div>
                      <div className={`step-node ${formStep >= 3 ? 'active' : ''}`}>3</div>
                    </div>

                    <form onSubmit={handleSubmit}>
                      {/* Step 1 Fields */}
                      {formStep === 1 && (
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '0.8rem', color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                            1. Personal Information
                          </div>
                          
                          <div className="form-group">
                            <label style={{ fontSize: '0.7rem' }}>Full Name</label>
                            <input
                              type="text"
                              className="form-control"
                              style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}
                              value={formData.name}
                              onChange={(e) => setFormData({...formData, name: e.target.value})}
                              required
                            />
                          </div>

                          <div className="form-group">
                            <label style={{ fontSize: '0.7rem' }}>Phone Number</label>
                            <input
                              type="text"
                              className="form-control"
                              style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                              required
                            />
                          </div>

                          <div className="form-group">
                            <label style={{ fontSize: '0.7rem' }}>Passport Number</label>
                            <input
                              type="text"
                              className="form-control"
                              style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}
                              value={formData.passport}
                              onChange={(e) => setFormData({...formData, passport: e.target.value})}
                              required
                            />
                          </div>

                          <div className="form-group">
                            <label style={{ fontSize: '0.7rem' }}>Email Address</label>
                            <input
                              type="email"
                              className="form-control"
                              style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                              required
                            />
                          </div>

                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label style={{ fontSize: '0.7rem' }}>Postal Address</label>
                            <input
                              type="text"
                              className="form-control"
                              style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}
                              value={formData.address}
                              onChange={(e) => setFormData({...formData, address: e.target.value})}
                              required
                            />
                          </div>

                          <button type="button" onClick={nextStep} className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', fontSize: '0.8rem' }}>
                            Next Page
                          </button>
                        </div>
                      )}

                      {/* Step 2 Fields */}
                      {formStep === 2 && (
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '0.8rem', color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                            2. Loan & Collateral Details
                          </div>

                          <div className="form-group">
                            <label style={{ fontSize: '0.7rem' }}>Requested Amount (MVP)</label>
                            <input
                              type="number"
                              className="form-control"
                              style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}
                              value={formData.amount}
                              onChange={(e) => setFormData({...formData, amount: e.target.value})}
                              required
                            />
                          </div>

                          <div className="form-group">
                            <label style={{ fontSize: '0.7rem' }}>Term Length</label>
                            <select
                              className="form-control"
                              style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}
                              value={formData.term}
                              onChange={(e) => setFormData({...formData, term: e.target.value})}
                            >
                              <option value="1 Week">1 Week (15% Interest)</option>
                              <option value="2 Weeks">2 Weeks (25% Interest)</option>
                              <option value="3 Weeks">3 Weeks (30% Interest)</option>
                              <option value="4 Weeks">4 Weeks (35% Interest)</option>
                            </select>
                          </div>

                          <div className="form-group">
                            <label style={{ fontSize: '0.7rem' }}>Proposed Loan Type</label>
                            <select
                              className="form-control"
                              style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}
                              value={formData.type}
                              onChange={(e) => setFormData({...formData, type: e.target.value})}
                            >
                              <option value="Business Expansion Loan">Business Expansion Loan</option>
                              <option value="Emergency Working Capital">Emergency Working Capital</option>
                              <option value="Boiler Replacement">Boiler Replacement</option>
                              <option value="Retail Shop Renovation">Retail Shop Renovation</option>
                            </select>
                          </div>

                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label style={{ fontSize: '0.7rem' }}>Collateral Evidence Description</label>
                            <textarea
                              className="form-control"
                              rows="4"
                              style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem', resize: 'none' }}
                              value={formData.collateralDesc}
                              onChange={(e) => setFormData({...formData, collateralDesc: e.target.value})}
                              placeholder="List items, property registries, or invoices pledged..."
                              required
                            />
                          </div>

                          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                            <button type="button" onClick={prevStep} className="btn btn-outline" style={{ flex: 1, fontSize: '0.8rem' }}>
                              Back
                            </button>
                            <button type="button" onClick={nextStep} className="btn btn-primary" style={{ flex: 1, fontSize: '0.8rem' }}>
                              Next
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Step 3 Uploads */}
                      {formStep === 3 && (
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '0.8rem', color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                            3. Document Uploads
                          </div>
                          
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem', border: '1px solid var(--border-color-dark)', borderRadius: '4px', backgroundColor: 'white' }}>
                              <span style={{ fontSize: '0.75rem', fontWeight: '500' }}>Passport Identity Scan</span>
                              <input 
                                type="checkbox" 
                                checked={uploads.passportPhoto} 
                                onChange={(e) => setUploads({...uploads, passportPhoto: e.target.checked})} 
                              />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem', border: '1px solid var(--border-color-dark)', borderRadius: '4px', backgroundColor: 'white' }}>
                              <span style={{ fontSize: '0.75rem', fontWeight: '500' }}>Proof of Collateral Deeds</span>
                              <input 
                                type="checkbox" 
                                checked={uploads.propertyProof} 
                                onChange={(e) => setUploads({...uploads, propertyProof: e.target.checked})} 
                              />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem', border: '1px solid var(--border-color-dark)', borderRadius: '4px', backgroundColor: 'white' }}>
                              <span style={{ fontSize: '0.75rem', fontWeight: '500' }}>6 Month Bank Statements</span>
                              <input 
                                type="checkbox" 
                                checked={uploads.bankStatement} 
                                onChange={(e) => setUploads({...uploads, bankStatement: e.target.checked})} 
                              />
                            </div>
                          </div>

                          <div style={{
                            marginTop: '1.25rem',
                            padding: '0.75rem',
                            backgroundColor: '#fef2f2',
                            border: '1px solid #fee2e2',
                            borderRadius: '4px',
                            fontSize: '0.65rem',
                            color: '#991b1b',
                            lineHeight: '1.4'
                          }}>
                            <strong>Notice:</strong> By submitting, you authorize GIIN Sentinel auditing systems to verify and scan files for risk assessment.
                          </div>

                          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                            <button type="button" onClick={prevStep} className="btn btn-outline" style={{ flex: 1, fontSize: '0.8rem' }}>
                              Back
                            </button>
                            <button type="submit" className="btn btn-primary" style={{ flex: 1, fontSize: '0.8rem' }}>
                              Submit App
                            </button>
                          </div>
                        </div>
                      )}
                    </form>
                  </div>
                )}

                {/* 2. MY LOANS TAB */}
                {activeTab === 'my-loans' && (
                  <div>
                    <h2 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '0.25rem' }}>Loan Overview</h2>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                      Track outstanding balances and active repayments.
                    </p>

                    {/* MTN MoMo Disbursement Card */}
                    <div className="mobile-card" style={{
                      border: '1px solid ' + (momoStatus === 'Pending' ? '#fde68a' : momoStatus === 'Confirmed' ? '#a7f3d0' : '#fca5a5'),
                      borderLeft: '4px solid ' + (momoStatus === 'Pending' ? '#f59e0b' : momoStatus === 'Confirmed' ? '#10b981' : '#ef4444'),
                      padding: '1.25rem',
                      marginBottom: '1.5rem',
                      backgroundColor: '#ffffff'
                    }}>
                      {/* MoMo status banner */}
                      <div style={{
                        display: 'flex',
                        gap: '0.75rem',
                        alignItems: 'flex-start',
                        backgroundColor: momoStatus === 'Pending' ? '#fffbeb' : momoStatus === 'Confirmed' ? '#f0fdf4' : '#fef2f2',
                        padding: '0.75rem',
                        borderRadius: '6px',
                        marginBottom: '1.25rem',
                        border: '1px solid ' + (momoStatus === 'Pending' ? '#fef3c7' : momoStatus === 'Confirmed' ? '#dcfce7' : '#fee2e2')
                      }}>
                        <div style={{
                          color: momoStatus === 'Pending' ? '#d97706' : momoStatus === 'Confirmed' ? '#166534' : '#991b1b',
                          fontWeight: '700',
                          fontSize: '1.2rem',
                          marginTop: '-2px'
                        }}>
                          ⚠️
                        </div>
                        <div>
                          <strong style={{ fontSize: '0.75rem', color: '#0f172a', display: 'block' }}>
                            {momoStatus === 'Pending' ? 'Pending Disbursement Approval' : momoStatus === 'Confirmed' ? 'Disbursement Cleared' : 'Disbursement Rejected'}
                          </strong>
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                            {momoStatus === 'Pending' ? 'Institutional verification required for external MoMo settlement.' : momoStatus === 'Confirmed' ? 'Funds successfully settled to MTN mobile wallet.' : 'Settlement request declined.'}
                          </span>
                        </div>
                      </div>

                      {/* MoMo Value box */}
                      <div style={{ textAlign: 'center', marginBottom: '1.25rem', position: 'relative' }}>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', fontWeight: '700', letterSpacing: '0.05em' }}>REQUESTED AMOUNT</span>
                        <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', marginTop: '0.25rem' }}>
                          <span style={{ color: 'var(--color-primary)' }}>RWF </span>1,450,000
                        </div>
                        <span className={`badge ${
                          momoStatus === 'Pending' ? 'warning' : momoStatus === 'Confirmed' ? 'success' : 'danger'
                        }`} style={{ fontSize: '0.6rem', padding: '0.15rem 0.5rem', marginTop: '0.375rem' }}>
                          {momoStatus === 'Pending' ? '● Verification Awaited' : momoStatus === 'Confirmed' ? '● Settlement Complete' : '● Cancelled'}
                        </span>
                      </div>

                      {/* Recipient breakdown */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.75rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Recipient Name</span>
                          <strong style={{ color: 'var(--text-primary)' }}>Jean-Claude Bizimana</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Transaction ID</span>
                          <span style={{ fontFamily: 'monospace', fontWeight: '600' }}>TXN-882-SNTNL-012</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Payment Method</span>
                          <strong style={{ color: 'var(--text-primary)' }}>Equity Bank → MTN MoMo</strong>
                        </div>
                      </div>

                      {/* Agri-tech note banner */}
                      <div style={{
                        marginTop: '1.25rem',
                        padding: '0.6rem 0.75rem',
                        backgroundColor: '#eff6ff',
                        borderRadius: '6px',
                        border: '1px solid #dbeafe',
                        fontSize: '0.7rem',
                        color: '#1e40af',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        fontWeight: '500'
                      }}>
                        <ShieldCheck size={14} />
                        <span>This transaction matches approved credit limits.</span>
                      </div>

                      {/* Actions */}
                      {momoStatus === 'Pending' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1.25rem' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setMomoStatus('Confirmed');
                              alert('MTN MoMo payment confirmed via mobile interface!');
                            }}
                            className="btn btn-primary btn-small"
                            style={{ width: '100%', fontSize: '0.75rem', height: '34px' }}
                          >
                            Confirm via MoMo
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setMomoStatus('Rejected');
                              alert('MTN MoMo payment rejected.');
                            }}
                            className="btn btn-danger-outline btn-small"
                            style={{ width: '100%', fontSize: '0.75rem', height: '34px' }}
                          >
                            Reject Disbursement
                          </button>
                          
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', textAlign: 'center', marginTop: '0.25rem', lineHeight: '1.4' }}>
                            Confirming triggers an immediate transfer to recipient&apos;s wallet. This cannot be undone.
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Recipient Activity block */}
                    <div className="mobile-card" style={{ padding: '0.875rem', marginBottom: '1.5rem' }}>
                      <h4 style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
                        RECENT ACTIVITY FOR RECIPIENT
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-success)' }}></span> Loan Installment #3
                          </span>
                          <strong style={{ color: 'var(--color-success)' }}>Completed</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }}></span> Collateral Verification
                          </span>
                          <span style={{ color: 'var(--text-muted)' }}>12 Jun 2026</span>
                        </div>
                      </div>
                    </div>

                    {/* Active Loans Card Section */}
                    {activeLoans.length > 0 ? (
                      activeLoans.map((loan) => {
                        const totalPaidPercent = Math.round((loan.paid / loan.amount) * 100) || 0;
                        return (
                          <div key={loan.id} className="mobile-card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.65rem', fontWeight: '700', padding: '0.1rem 0.4rem', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', borderRadius: '4px' }}>
                                Active Loan
                              </span>
                              <span style={{ fontSize: '0.7rem', color: 'var(--color-danger)', fontWeight: '600' }}>
                                {loan.daysLeft} Days Left
                              </span>
                            </div>
                            
                            <h3 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '1rem' }}>{loan.type}</h3>

                            <div className="mobile-label-val">
                              <span className="mobile-label">Remaining Balance</span>
                              <span className="mobile-val" style={{ color: 'var(--color-danger)' }}>{loan.balance.toLocaleString()} MVP</span>
                            </div>
                            <div className="mobile-label-val">
                              <span className="mobile-label">Amount Cleared</span>
                              <span className="mobile-val" style={{ color: 'var(--color-success)' }}>{loan.paid.toLocaleString()} MVP</span>
                            </div>
                            <div className="mobile-label-val">
                              <span className="mobile-label">Next Payment</span>
                              <span className="mobile-val">4,500 MVP (Aug 15)</span>
                            </div>

                            <div className="progress-container">
                              <div className="progress-bar" style={{ width: `${totalPaidPercent}%` }}></div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                              <span>{totalPaidPercent}% cleared</span>
                              <span>{loan.amount.toLocaleString()} MVP Total</span>
                            </div>

                            <button
                              onClick={() => handlePayment(loan.id, 4500)}
                              className="btn btn-primary"
                              style={{ width: '100%', fontSize: '0.8rem', padding: '0.4rem' }}
                            >
                              Make Installment Payment (4,500 MVP)
                            </button>
                          </div>
                        );
                      })
                    ) : (
                      <div className="mobile-card" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                        <Landmark size={32} color="#cbd5e1" style={{ marginBottom: '0.75rem' }} />
                        <h4 style={{ fontSize: '0.85rem', fontWeight: '700' }}>No Other Active Loans</h4>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                          Submit an application under the 'Apply' tab.
                        </p>
                      </div>
                    )}

                    {/* Loan History Section */}
                    <div style={{ marginTop: '1.5rem' }}>
                      <h4 style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                        Loan History
                      </h4>
                      <div className="mobile-card" style={{ padding: '0.5rem 1rem' }}>
                        {completedLoans.map((hist, index) => (
                          <div key={index} className="mobile-list-item">
                            <div>
                              <div style={{ fontSize: '0.75rem', fontWeight: '700' }}>{hist.type}</div>
                              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>ID: {hist.id}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <span style={{ fontSize: '0.7rem', color: 'var(--color-success)', fontWeight: '700', display: 'block' }}>
                                Repaid
                              </span>
                              <span style={{ fontSize: '0.7rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                                {hist.amount.toLocaleString()} MVP
                              </span>
                            </div>
                          </div>
                        ))}
                        {completedLoans.length === 0 && (
                          <div style={{ textAlign: 'center', padding: '1rem 0', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            No repayment logs.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Info banners */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                        <ShieldCheck size={16} color="var(--color-success)" style={{ flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: '0.7rem', fontWeight: '700' }}>Secure Institution</div>
                          <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>Funds are audited by GIIN certified smart contracts.</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                        <HelpCircle size={16} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: '0.7rem', fontWeight: '700' }}>24/7 Advisor Assistance</div>
                          <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>Your dedicated team of advisors is always reachable.</div>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* 3. PROFILE TAB */}
                {activeTab === 'profile' && (
                  <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h2 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '0.125rem', textAlign: 'center' }}>Institutional Profile</h2>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', textAlign: 'center' }}>
                      Review and manage your institutional identification and security settings.
                    </p>

                    {/* Card 1: Primary Contact */}
                    <div className="mobile-card" style={{ padding: '0.875rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.25rem' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--color-primary)' }}>Primary Contact</span>
                        <button type="button" onClick={() => alert('Primary contact editing is locked during active cycles.')} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '0.65rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}>
                          <Edit size={10} /> EDIT
                        </button>
                      </div>
                      <div style={{ fontSize: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0.25rem 0' }}>
                          <span style={{ color: 'var(--text-muted)' }}>FULL NAME</span>
                          <strong style={{ color: 'var(--text-primary)' }}>Alexander J. Sterling</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0.25rem 0' }}>
                          <span style={{ color: 'var(--text-muted)' }}>EMAIL</span>
                          <span style={{ fontWeight: '600' }}>a.sterling@institute.edu</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0.25rem 0' }}>
                          <span style={{ color: 'var(--text-muted)' }}>PHONE</span>
                          <span style={{ fontWeight: '600' }}>+1 (555) 012-3456</span>
                        </div>
                      </div>
                    </div>

                    {/* Card 2: Institutional Identity */}
                    <div className="mobile-card" style={{ padding: '0.875rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.25rem' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--color-primary)' }}>Institutional Identity</span>
                      </div>
                      <div style={{ fontSize: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0.25rem 0' }}>
                          <span style={{ color: 'var(--text-muted)' }}>STUDENT ID</span>
                          <strong style={{ color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            STU-8829-0012 <CheckCircle size={10} />
                          </strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0.25rem 0' }}>
                          <span style={{ color: 'var(--text-muted)' }}>NATIONAL ID</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ fontWeight: '600', fontFamily: 'monospace' }}>
                              {showNationalId ? '8829 4402 9921' : '**** **** 9921'}
                            </span>
                            <button
                              type="button"
                              onClick={() => setShowNationalId(!showNationalId)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', display: 'flex', padding: 0 }}
                            >
                              {showNationalId ? <EyeOff size={12} /> : <Eye size={12} />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card 3: Linked Devices */}
                    <div className="mobile-card" style={{ padding: '0.875rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.25rem' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--color-primary)' }}>Linked Devices</span>
                        <span style={{ fontSize: '0.6rem', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', padding: '0.1rem 0.3rem', borderRadius: '4px', fontWeight: '700' }}>2 ACTIVE</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', padding: '0.25rem 0' }}>
                          <div>
                            <div style={{ fontWeight: '700' }}>MacBook Pro 14&quot;</div>
                            <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Chrome • San Francisco, CA</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', padding: '0.25rem 0' }}>
                          <div>
                            <div style={{ fontWeight: '700' }}>iPhone 15 Pro</div>
                            <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>GIIN App • 2 hours ago</div>
                          </div>
                          <button type="button" onClick={() => alert('Logging device session out...')} style={{ background: 'none', border: 'none', color: 'var(--color-danger)', fontSize: '0.65rem', cursor: 'pointer' }}>
                            Log out
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Card 4: Active Security */}
                    <div className="mobile-card" style={{ padding: '0.875rem', backgroundColor: '#0b0f19', color: 'white', border: '1px solid #1e293b' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#60a5fa' }}>Active Security</span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--color-success)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '2px' }}>
                          2FA ENABLED <Check size={10} />
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <button type="button" onClick={() => alert('Change password sequence initialized.')} className="btn btn-primary btn-small" style={{ width: '100%', fontSize: '0.7rem', padding: '0.375rem' }}>
                          Change Password
                        </button>
                        <button type="button" onClick={() => alert('Redirecting to device activity logs...')} className="btn btn-outline btn-small" style={{ width: '100%', fontSize: '0.7rem', padding: '0.375rem', borderColor: '#334155', color: '#94a3b8' }}>
                          View Security Logs
                        </button>
                      </div>
                    </div>

                    {/* Card 5: Profile Completion */}
                    <div className="mobile-card" style={{ padding: '0.875rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: '700', marginBottom: '0.25rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>INSTITUTIONAL STATUS</span>
                        <span style={{ color: 'var(--color-primary)' }}>85%</span>
                      </div>
                      <div className="progress-container" style={{ margin: 0, height: '6px' }}>
                        <div className="progress-bar" style={{ width: '85%' }}></div>
                      </div>
                      <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.375rem', lineHeight: '1.3' }}>
                        Complete your &quot;Social Verification&quot; to reach 100% and unlock lower interest rates.
                      </span>
                    </div>

                    {/* Badge holograms badge mock */}
                    <div style={{
                      padding: '1.25rem',
                      borderRadius: '8px',
                      background: 'radial-gradient(circle at top right, #1d4ed8 0%, #020617 100%)',
                      border: '2.5px solid #3b82f6',
                      textAlign: 'center',
                      color: 'white',
                      boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)'
                    }}>
                      <div style={{ fontSize: '0.6rem', color: '#60a5fa', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        GIIN Sentinel Security ID
                      </div>
                      <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        border: '2px solid #3b82f6',
                        margin: '0.75rem auto 0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#1e293b'
                      }}>
                        🛡️
                      </div>
                      <div style={{ fontWeight: '800', fontSize: '0.85rem' }}>Alexander Sterling</div>
                      <div style={{ fontSize: '0.6rem', color: '#94a3b8', marginTop: '0.125rem' }}>Node Level: Institutional Client</div>
                    </div>
                  </div>
                )}

              </div>

              {/* Simulator Footer */}
              <div className="device-footer">
                <button onClick={() => setActiveTab('apply')} className={`device-tab ${activeTab === 'apply' ? 'active' : ''}`}>
                  <Clipboard size={18} />
                  <span>Apply</span>
                </button>
                <button onClick={() => setActiveTab('my-loans')} className={`device-tab ${activeTab === 'my-loans' ? 'active' : ''}`}>
                  <CreditCard size={18} />
                  <span>My Loans</span>
                </button>
                <button onClick={() => setActiveTab('profile')} className={`device-tab ${activeTab === 'profile' ? 'active' : ''}`}>
                  <User size={18} />
                  <span>Profile</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interaction Tutorial & Live Flow details */}
        <div>
          <div className="card">
            <h3 className="card-title">Interactive Simulator Guidelines</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem', lineHeight: 1.6 }}>
              This module operates as a fully integrated client client app simulator. Use the phone on the left to test the end-to-end data pipeline.
            </p>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              marginTop: '1.5rem'
            }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <span style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '0.8rem',
                  flexShrink: 0
                }}>
                  1
                </span>
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: '700' }}>Submit a Loan Application</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>
                    Navigate to the <strong>Apply</strong> tab in the phone mockup, fill out details (Step 1 & 2), select checkboxes (Step 3), and submit the form.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <span style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '0.8rem',
                  flexShrink: 0
                }}>
                  2
                </span>
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: '700' }}>Review inside Approval Center</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>
                    Click on the <strong>Approval Center</strong> tab in the main sidebar. Your submitted application will appear instantly in the queue. Review files and click **Approve Application**.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <span style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '0.8rem',
                  flexShrink: 0
                }}>
                  3
                </span>
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: '700' }}>Verify in Ledger & Process Repayments</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>
                    Once approved, the loan displays on the **Dashboard** and **Main Tracker** tables. Go back to the **Mobile App** tab, select **My Loans** in the phone frame, and click **Make Installment Payment** to see outstanding balances deduct dynamically!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
