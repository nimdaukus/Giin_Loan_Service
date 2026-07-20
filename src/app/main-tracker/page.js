'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Download, Plus, Filter, Search, ShieldCheck, CheckCircle2, AlertTriangle, X, Mail, Phone, MapPin, User, FileText, Landmark, Calculator, Edit, Trash2 } from 'lucide-react';

export default function MainTracker() {
  const { loans, metrics, addManualLoan, updateLoanStatus, makePayment, modifyLoanRecord, deleteLoanRecord } = useApp();
  
  // States for filter inputs
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('dueDate');
  
  // State for Add Manual Entry Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [manualForm, setManualForm] = useState({
    borrowerName: '',
    phone: '',
    email: '',
    idType: 'National ID',
    documentId: '',
    address: '',
    type: 'Business Expansion Loan',
    amount: '',
    interestRate: '15',
    term: '1 Week',
    loanDate: new Date().toISOString().split('T')[0],
    repaymentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    collateralDesc: ''
  });

  // State for selected borrower drawer detail panel
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [settlementAmount, setSettlementAmount] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);

  const handleSelectLoan = (loan) => {
    setSelectedLoan(loan);
    setEditForm({ ...loan });
    setIsEditing(false);
  };

  // Filter & Search Logic
  const filteredLoans = loans
    .filter(loan => {
      const matchStatus = statusFilter === 'All' || loan.status === statusFilter;
      const matchSearch = loan.borrowerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          loan.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          loan.contractId.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    })
    .sort((a, b) => {
      if (sortField === 'dueDate') {
        return new Date(a.repaymentDate) - new Date(b.repaymentDate);
      } else if (sortField === 'amount') {
        return b.amount - a.amount;
      } else if (sortField === 'borrower') {
        return a.borrowerName.localeCompare(b.borrowerName);
      }
      return 0;
    });

  // Handle manual form submission
  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualForm.borrowerName || !manualForm.amount || !manualForm.repaymentDate || !manualForm.interestRate) {
      alert('Please fill in all required fields.');
      return;
    }

    addManualLoan(manualForm);
    setIsModalOpen(false);
    
    // Reset manual form
    setManualForm({
      borrowerName: '',
      phone: '',
      email: '',
      idType: 'National ID',
      documentId: '',
      address: '',
      type: 'Business Expansion Loan',
      amount: '',
      interestRate: '9.5',
      loanDate: new Date().toISOString().split('T')[0],
      repaymentDate: '',
      collateralDesc: ''
    });
  };

  // Handle settlement recording from drawer panel
  const handleSettleRepayment = (e) => {
    e.preventDefault();
    if (!selectedLoan || !settlementAmount || parseFloat(settlementAmount) <= 0) {
      alert('Please enter a valid repayment amount.');
      return;
    }

    const payVal = parseFloat(settlementAmount);
    makePayment(selectedLoan.id, payVal);
    setSettlementAmount('');
    alert(`Repayment of ${payVal.toLocaleString()} MVP recorded successfully.`);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editForm.borrowerName || !editForm.amount || !editForm.interestRate) {
      alert('Please fill in all required fields.');
      return;
    }
    modifyLoanRecord(editForm.id, editForm);
    setIsEditing(false);
    alert('Loan record updated successfully.');
  };

  // Calculations for manual modal in real-time
  const calculatedInterest = manualForm.amount && manualForm.interestRate 
    ? Math.round(parseFloat(manualForm.amount) * (parseFloat(manualForm.interestRate) / 100))
    : 0;
  const calculatedTotalRepayment = manualForm.amount 
    ? parseFloat(manualForm.amount) + calculatedInterest
    : 0;

  const exportCSV = () => {
    const headers = [
      'Borrower Name', 'Phone', 'Email', 'ID Type/Passport', 'Address', 'Loan Type', 
      'Principal Amount (MVP)', 'Interest Rate', 'Interest Amount (MVP)', 
      'Total Repayment (MVP)', 'Loan Date', 'Contract ID', 'Repayment Date', 
      'Paid (MVP)', 'Balance (MVP)', 'Status', 'Collateral Description'
    ];
    const rows = filteredLoans.map(loan => [
      loan.borrowerName,
      loan.phone || 'N/A',
      loan.email || 'N/A',
      loan.passport || 'N/A',
      loan.address || 'N/A',
      loan.type,
      loan.amount,
      loan.interestRate,
      loan.interestAmount || 0,
      loan.totalRepayment || loan.amount,
      loan.loanDate || 'N/A',
      loan.contractId,
      loan.repaymentDate,
      loan.paid,
      loan.balance,
      loan.status,
      loan.collateralDesc || 'N/A'
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `GIIN_Sentinel_Loans_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Header section */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }} className="no-print">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Main Tracker</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Monitoring {loans.length} active loans across institutional credit nodes.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={exportCSV} className="btn btn-outline">
            <Download size={16} /> Export Data
          </button>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
            <Plus size={16} /> Add Manual Entry
          </button>
        </div>
      </div>

      {/* Filters Card */}
      <div className="card" style={{ marginTop: '2rem', padding: '1rem 1.5rem', marginBottom: '1.5rem' }} className="no-print">
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1.5rem',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', gap: '1rem', flex: 1, minWidth: '300px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#f1f5f9',
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              flex: 1
            }}>
              <Search size={16} color="#64748b" />
              <input 
                type="text" 
                placeholder="Search borrower name, loan type, or hash..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem', width: '100%' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={16} color="#64748b" />
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  border: '1px solid var(--border-color-dark)',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  backgroundColor: 'white',
                  outline: 'none'
                }}
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Sort By:</span>
            <select 
              value={sortField} 
              onChange={(e) => setSortField(e.target.value)}
              style={{
                border: '1px solid var(--border-color-dark)',
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                backgroundColor: 'white',
                outline: 'none'
              }}
            >
              <option value="dueDate">Repayment Date</option>
              <option value="amount">Principal Value</option>
              <option value="borrower">Borrower Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Ledger Table */}
      <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
        <table className="custom-table" style={{ width: '100%', minWidth: '1100px' }}>
          <thead>
            <tr>
              <th>Borrower Profile</th>
              <th>Loan Duration</th>
              <th>Type &amp; Hash</th>
              <th style={{ textAlign: 'right' }}>Principal</th>
              <th style={{ textAlign: 'right' }}>Rate %</th>
              <th style={{ textAlign: 'right' }}>Accrued Interest</th>
              <th style={{ textAlign: 'right' }}>Total Repayable</th>
              <th style={{ textAlign: 'right' }}>Paid</th>
              <th style={{ textAlign: 'right' }}>Balance</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredLoans.map((loan) => (
              <tr 
                key={loan.id} 
                style={{ cursor: 'pointer', transition: 'background var(--transition-fast)' }}
                onClick={() => handleSelectLoan(loan)}
                className="hover-row"
              >
                <td>
                  <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{loan.borrowerName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {loan.id}</div>
                </td>
                <td>
                  <div style={{ fontSize: '0.8rem', fontWeight: '500' }}>
                    Start: <span style={{ color: 'var(--text-secondary)' }}>{loan.loanDate || '2026-07-12'}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '500', marginTop: '0.15rem' }}>
                    Due: <span style={{ color: 'var(--color-primary)' }}>{loan.repaymentDate}</span>
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight: '600', fontSize: '0.8rem' }}>{loan.type}</div>
                  <code style={{
                    backgroundColor: '#f1f5f9',
                    padding: '0.15rem 0.3rem',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    color: 'var(--text-secondary)',
                    marginTop: '0.2rem',
                    display: 'inline-block'
                  }}>
                    {loan.contractId}
                  </code>
                </td>
                <td style={{ textAlign: 'right', fontWeight: '600' }}>
                  {loan.amount.toLocaleString()} MVP
                </td>
                <td style={{ textAlign: 'right', fontWeight: '600', color: 'var(--text-secondary)' }}>
                  {loan.interestRate}
                </td>
                <td style={{ textAlign: 'right', fontWeight: '600', color: 'var(--color-warning-text)' }}>
                  {(loan.interestAmount || 0).toLocaleString()} MVP
                </td>
                <td style={{ textAlign: 'right', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {(loan.totalRepayment || (loan.amount + (loan.interestAmount || 0))).toLocaleString()} MVP
                </td>
                <td style={{ textAlign: 'right', color: 'var(--color-success)', fontWeight: '600' }}>
                  {loan.paid.toLocaleString()} MVP
                </td>
                <td style={{ textAlign: 'right', color: loan.balance > 0 ? 'var(--color-danger)' : 'var(--text-secondary)', fontWeight: '600' }}>
                  {loan.balance.toLocaleString()} MVP
                </td>
                <td onClick={(e) => e.stopPropagation()}>
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <select
                      value={loan.status}
                      onChange={(e) => updateLoanStatus(loan.id, e.target.value)}
                      style={{
                        border: 'none',
                        borderRadius: '50px',
                        padding: '0.25rem 1.5rem 0.25rem 0.75rem',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        backgroundColor: loan.status === 'Completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        color: loan.status === 'Completed' ? '#10b981' : '#f59e0b',
                        cursor: 'pointer',
                        outline: 'none',
                        WebkitAppearance: 'none',
                        appearance: 'none',
                        display: 'inline-block',
                        textAlign: 'center'
                      }}
                    >
                      <option value="Active">Active</option>
                      <option value="Completed">Completed</option>
                    </select>
                    <span style={{
                      position: 'absolute',
                      right: '0.5rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '0.5rem',
                      color: loan.status === 'Completed' ? '#10b981' : '#f59e0b',
                      pointerEvents: 'none'
                    }}>
                      ▼
                    </span>
                  </div>
                </td>
              </tr>
            ))}

            {filteredLoans.length === 0 && (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                  No loans found matching your query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Metrics Summary Panels */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        marginTop: '2rem'
      }} className="no-print">
        <div style={{ backgroundColor: '#eff6ff', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #dbeafe' }}>
          <div style={{ fontSize: '0.75rem', color: '#1e40af', fontWeight: '700', textTransform: 'uppercase' }}>Portfolio Active</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e3a8a', marginTop: '0.25rem' }}>
            ${(metrics.totalOutstanding).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#60a5fa', marginTop: '0.125rem' }}>Dynamic Active Volume</div>
        </div>
        <div style={{ backgroundColor: '#f0fdf4', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #dcfce7' }}>
          <div style={{ fontSize: '0.75rem', color: '#166534', fontWeight: '700', textTransform: 'uppercase' }}>Average Interest</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#14532d', marginTop: '0.25rem' }}>9.2%</div>
          <div style={{ fontSize: '0.7rem', color: '#4ade80', marginTop: '0.125rem' }}>Weighted average rate</div>
        </div>
        <div style={{ backgroundColor: '#fffbeb', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #fef3c7' }}>
          <div style={{ fontSize: '0.75rem', color: '#854d0e', fontWeight: '700', textTransform: 'uppercase' }}>Repayment Rate</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#78350f', marginTop: '0.25rem' }}>98.4%</div>
          <div style={{ fontSize: '0.7rem', color: '#fbbf24', marginTop: '0.125rem' }}>98.1% Delivery SLA</div>
        </div>
        <div style={{ backgroundColor: '#fef2f2', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #fee2e2' }}>
          <div style={{ fontSize: '0.75rem', color: '#991b1b', fontWeight: '700', textTransform: 'uppercase' }}>Outstanding Actions</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#7f1d1d', marginTop: '0.25rem' }}>
            {metrics.pendingApprovals}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#f87171', marginTop: '0.125rem' }}>Require manual sign off</div>
        </div>
      </div>

      {/* Manual Entry Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="card" style={{
            width: '600px',
            maxHeight: '90vh',
            overflowY: 'auto',
            backgroundColor: 'white',
            boxShadow: 'var(--shadow-lg)',
            margin: 0,
            padding: '2rem',
            borderRadius: '12px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: '1rem',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Add Manual Loan Entry</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
              >
                <X size={18} color="#64748b" />
              </button>
            </div>

            <form onSubmit={handleManualSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Borrower Full Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Jean Paul H." 
                    value={manualForm.borrowerName}
                    onChange={(e) => setManualForm({...manualForm, borrowerName: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Institutional Email</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    placeholder="name@university.ac.rw" 
                    value={manualForm.email}
                    onChange={(e) => setManualForm({...manualForm, email: e.target.value})}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input 
                    type="tel" 
                    className="form-control" 
                    placeholder="+250 788 000 111" 
                    value={manualForm.phone}
                    onChange={(e) => setManualForm({...manualForm, phone: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="KG 541 St, Kigali" 
                    value={manualForm.address}
                    onChange={(e) => setManualForm({...manualForm, address: e.target.value})}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>ID Document Type</label>
                  <select 
                    className="form-control"
                    value={manualForm.idType}
                    onChange={(e) => setManualForm({...manualForm, idType: e.target.value})}
                  >
                    <option value="National ID">National ID</option>
                    <option value="Passport">Passport</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Document Number / ID</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="119988001223" 
                    value={manualForm.documentId}
                    onChange={(e) => setManualForm({...manualForm, documentId: e.target.value})}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Loan Type</label>
                  <select 
                    className="form-control"
                    value={manualForm.type}
                    onChange={(e) => setManualForm({...manualForm, type: e.target.value})}
                  >
                    <option value="Business Expansion Loan">Business Expansion Loan</option>
                    <option value="Emergency Working Capital">Emergency Working Capital</option>
                    <option value="Boiler Replacement">Boiler Replacement</option>
                    <option value="Retail Shop Renovation">Retail Shop Renovation</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Principal Amount (MVP)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder="e.g. 50000"
                    value={manualForm.amount}
                    onChange={(e) => setManualForm({...manualForm, amount: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Term &amp; Interest Bracket</label>
                  <select
                    className="form-control"
                    value={manualForm.term || '1 Week'}
                    onChange={(e) => {
                      const selectedTerm = e.target.value;
                      let rateVal = '15';
                      let daysToAdd = 7;
                      if (selectedTerm === '2 Weeks') {
                        rateVal = '25';
                        daysToAdd = 14;
                      } else if (selectedTerm === '3 Weeks') {
                        rateVal = '30';
                        daysToAdd = 21;
                      } else if (selectedTerm === '4 Weeks') {
                        rateVal = '35';
                        daysToAdd = 28;
                      }
                      
                      const baseDate = new Date(manualForm.loanDate);
                      const dueVal = new Date(baseDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                      
                      setManualForm({
                        ...manualForm,
                        term: selectedTerm,
                        interestRate: rateVal,
                        repaymentDate: dueVal
                      });
                    }}
                  >
                    <option value="1 Week">1 Week (15% Interest)</option>
                    <option value="2 Weeks">2 Weeks (25% Interest)</option>
                    <option value="3 Weeks">3 Weeks (30% Interest)</option>
                    <option value="4 Weeks">4 Weeks (35% Interest)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Loan Date</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    value={manualForm.loanDate}
                    onChange={(e) => {
                      const newLoanDate = e.target.value;
                      let daysToAdd = 7;
                      if (manualForm.term === '2 Weeks') daysToAdd = 14;
                      else if (manualForm.term === '3 Weeks') daysToAdd = 21;
                      else if (manualForm.term === '4 Weeks') daysToAdd = 28;
                      
                      const baseDate = new Date(newLoanDate);
                      const dueVal = new Date(baseDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                      
                      setManualForm({
                        ...manualForm,
                        loanDate: newLoanDate,
                        repaymentDate: dueVal
                      });
                    }}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Repayment Due Date (Auto-calculated)</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={manualForm.repaymentDate}
                  readOnly
                  style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
                />
              </div>

              <div className="form-group">
                <label>Collateral Description</label>
                <textarea 
                  className="form-control" 
                  placeholder="Describe HP Laptop model, serial codes, vehicle specifications, etc."
                  value={manualForm.collateralDesc}
                  onChange={(e) => setManualForm({...manualForm, collateralDesc: e.target.value})}
                  rows="2"
                />
              </div>

              {/* Dynamic computed calculations box */}
              <div style={{
                backgroundColor: '#fafafa',
                border: '1px dashed var(--border-color-dark)',
                borderRadius: '8px',
                padding: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                marginTop: '0.5rem'
              }}>
                <div>
                  Interest to pay: <strong style={{ color: 'var(--color-warning-text)' }}>{calculatedInterest.toLocaleString()} MVP</strong>
                </div>
                <div>
                  Total Repayable: <strong style={{ color: 'var(--color-primary)' }}>{calculatedTotalRepayment.toLocaleString()} MVP</strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button 
                  type="button" 
                  className="btn btn-outline" 
                  style={{ flex: 1 }}
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  style={{ flex: 2 }}
                >
                  Create Loan Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Selected Borrower Detail Side Panel/Drawer */}
      {selectedLoan && (() => {
        const activeSelectedLoan = loans.find(l => l.id === selectedLoan.id);
        if (!activeSelectedLoan) return null;
        return (
          <div 
            className="animate-slide-in-right"
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '450px',
              backgroundColor: '#ffffff',
              boxShadow: '-10px 0 30px rgba(15, 23, 42, 0.15)',
              zIndex: 1100,
              borderLeft: '1px solid var(--border-color-dark)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#f8fafc'
            }}>
              <div>
                <span style={{ fontSize: '0.65rem', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', fontWeight: '700', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                  {activeSelectedLoan.id}
                </span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginTop: '0.25rem' }}>
                  {isEditing ? 'Edit Borrower Record' : 'Borrower Management'}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedLoan(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
              >
                <X size={18} color="#64748b" />
              </button>
            </div>

            {/* Content Wrapper */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {isEditing ? (
                /* Edit Form Mode */
                <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '0.7rem', fontWeight: '700' }}>Borrower Full Name</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      value={editForm.borrowerName}
                      onChange={(e) => setEditForm({ ...editForm, borrowerName: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label style={{ fontSize: '0.7rem', fontWeight: '700' }}>ID Document / Passport</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editForm.passport}
                      onChange={(e) => setEditForm({ ...editForm, passport: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label style={{ fontSize: '0.7rem', fontWeight: '700' }}>Phone Number</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label style={{ fontSize: '0.7rem', fontWeight: '700' }}>Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label style={{ fontSize: '0.7rem', fontWeight: '700' }}>Residential Address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editForm.address}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label style={{ fontSize: '0.7rem', fontWeight: '700' }}>Borrowed Principal (MVP)</label>
                      <input
                        type="number"
                        required
                        className="form-control"
                        value={editForm.amount}
                        onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label style={{ fontSize: '0.7rem', fontWeight: '700' }}>Interest Rate (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        className="form-control"
                        value={editForm.interestRate.replace('%', '')}
                        onChange={(e) => setEditForm({ ...editForm, interestRate: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label style={{ fontSize: '0.7rem', fontWeight: '700' }}>Repayment Due Date</label>
                    <input
                      type="date"
                      required
                      className="form-control"
                      value={editForm.repaymentDate}
                      onChange={(e) => setEditForm({ ...editForm, repaymentDate: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label style={{ fontSize: '0.7rem', fontWeight: '700' }}>Collateral Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={editForm.collateralDesc}
                      onChange={(e) => setEditForm({ ...editForm, collateralDesc: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                    <button 
                      type="button" 
                      onClick={() => setIsEditing(false)} 
                      className="btn btn-outline" 
                      style={{ flex: 1 }}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary" 
                      style={{ flex: 2 }}
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                /* Viewer Mode */
                <>
                  {/* Profile Section */}
                  <div>
                    <h4 style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
                      Borrower Profile
                    </h4>
                    <div className="card" style={{ margin: 0, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <User size={18} color="var(--color-primary)" />
                        </div>
                        <div>
                          <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)', display: 'block' }}>{activeSelectedLoan.borrowerName}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{activeSelectedLoan.passport || 'N/A'}</span>
                        </div>
                      </div>
                      
                      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                          <Phone size={14} color="#64748b" /> {activeSelectedLoan.phone || 'N/A'}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                          <Mail size={14} color="#64748b" /> {activeSelectedLoan.email || 'N/A'}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                          <MapPin size={14} color="#64748b" /> {activeSelectedLoan.address || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Financial Ledger Section */}
                  <div>
                    <h4 style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
                      Credit Parameters
                    </h4>
                    <div className="card" style={{ margin: 0, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Loan Date:</span>
                        <strong style={{ color: 'var(--text-primary)' }}>{activeSelectedLoan.loanDate || '2026-07-12'}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Due Date:</span>
                        <strong style={{ color: 'var(--color-primary)' }}>{activeSelectedLoan.repaymentDate}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Interest Rate:</span>
                        <strong style={{ color: 'var(--text-primary)' }}>{activeSelectedLoan.interestRate}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Accrued Interest:</span>
                        <strong style={{ color: 'var(--color-warning-text)' }}>{(activeSelectedLoan.interestAmount || 0).toLocaleString()} MVP</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Borrowed Principal:</span>
                        <strong style={{ color: 'var(--text-primary)' }}>{activeSelectedLoan.amount.toLocaleString()} MVP</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span style={{ color: 'var(--text-secondary)', fontWeight: '700' }}>Total Repayment:</span>
                        <strong style={{ color: 'var(--text-primary)', fontWeight: '800' }}>{activeSelectedLoan.totalRepayment.toLocaleString()} MVP</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--color-success)', fontWeight: '600' }}>
                        <span>Total Settled:</span>
                        <span>{activeSelectedLoan.paid.toLocaleString()} MVP</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: activeSelectedLoan.balance > 0 ? 'var(--color-danger)' : 'var(--text-secondary)', fontWeight: '700', borderTop: '1.5px solid #f1f5f9', paddingTop: '0.5rem' }}>
                        <span>Balance Outstanding:</span>
                        <span>{activeSelectedLoan.balance.toLocaleString()} MVP</span>
                      </div>
                    </div>
                  </div>

                  {/* Collateral Details */}
                  <div>
                    <h4 style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
                      Pledged Collateral
                    </h4>
                    <div className="card" style={{ margin: 0, padding: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: '#f1f5f9',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.25rem'
                      }}>
                        📦
                      </div>
                      <div>
                        <strong style={{ fontSize: '0.8rem', color: 'var(--text-primary)', display: 'block' }}>Collateral Reference</strong>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
                          {activeSelectedLoan.collateralDesc || 'No collateral description uploaded.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Manual Settlement Entry Form */}
                  {activeSelectedLoan.balance > 0 && (
                    <div>
                      <h4 style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
                        Record Payment Settlement
                      </h4>
                      <form onSubmit={handleSettleRepayment} className="card" style={{ margin: 0, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label style={{ fontSize: '0.65rem' }}>Settlement Value (MVP)</label>
                          <input 
                            type="number"
                            required
                            className="form-control"
                            placeholder={`Max. ${activeSelectedLoan.balance}`}
                            value={settlementAmount}
                            onChange={(e) => setSettlementAmount(e.target.value)}
                          />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.5rem', fontSize: '0.8rem' }}>
                          Confirm Settlement Payment
                        </button>
                      </form>
                    </div>
                  )}
                </>
              )}

            </div>

            {/* Footer actions */}
            <div style={{
              padding: '1.5rem',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              backgroundColor: '#f8fafc'
            }}>
              {!isEditing && (
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button 
                    onClick={() => {
                      setEditForm({ ...activeSelectedLoan });
                      setIsEditing(true);
                    }}
                    className="btn btn-outline"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem' }}
                  >
                    <Edit size={14} /> Edit Details
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete ${activeSelectedLoan.borrowerName}'s loan record entirely? This action cannot be undone.`)) {
                        deleteLoanRecord(activeSelectedLoan.id);
                        setSelectedLoan(null);
                        alert('Record successfully deleted.');
                      }
                    }}
                    className="btn btn-outline"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem', color: 'var(--color-danger-text)', borderColor: 'rgba(239,68,68,0.2)' }}
                  >
                    <Trash2 size={14} /> Delete Record
                  </button>
                </div>
              )}
              <button 
                onClick={() => setSelectedLoan(null)}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Close Panel
              </button>
            </div>
          </div>
        );
      })()}

    </div>
  );
}
