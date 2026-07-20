'use client';

import React, { useState } from 'react';
import { Smartphone, Laptop, Car, Plus, Edit, UserPlus, Save, CheckCircle, Download, Shield } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function SettingsPortal() {
  const { currency, setCurrency, language, setLanguage, currentUser, users, addStaffMember } = useApp();
  const [apr, setApr] = useState(18.5);
  const [lateFee, setLateFee] = useState(2.0);
  const [toastMessage, setToastMessage] = useState(null);

  const isAuthorized = currentUser?.role === 'System Admin' || currentUser?.role === 'GLOBAL ACCESS';

  if (!isAuthorized) {
    return (
      <div style={{
        padding: '3rem',
        textAlign: 'center',
        maxWidth: '500px',
        margin: '5rem auto',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-lg)',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: '#fef2f2',
          color: '#ef4444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem'
        }}>
          <Shield size={36} />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.75rem', color: '#0f172a' }}>Access Denied</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
          Your current account role ({currentUser?.role || 'Guest'}) lacks the required clearances to access or modify global settings.
        </p>
      </div>
    );
  }

  // Staff creation form states
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [staffRole, setStaffRole] = useState('Loan Officer');
  const [staffPerms, setStaffPerms] = useState({
    apply_loans: true,
    disburse_loans: false,
    edit_loans: false,
    send_reminders: false,
    view_analytics: true
  });

  const handleAddStaffSubmit = (e) => {
    e.preventDefault();
    if (!staffName || !staffEmail || !staffPassword) {
      alert('Please fill out all staff fields.');
      return;
    }
    const selectedPerms = Object.keys(staffPerms).filter(key => staffPerms[key]);
    addStaffMember({
      name: staffName,
      email: staffEmail,
      password: staffPassword,
      role: staffRole,
      permissions: selectedPerms
    });
    showToast(`Staff member ${staffName} registered successfully!`);
    setIsStaffModalOpen(false);
    
    // Reset form
    setStaffName('');
    setStaffEmail('');
    setStaffPassword('');
    setStaffRole('Loan Officer');
    setStaffPerms({
      apply_loans: true,
      disburse_loans: false,
      edit_loans: false,
      send_reminders: false,
      view_analytics: true
    });
  };

  // Collateral categories state
  const [collaterals, setCollaterals] = useState([
    { class: 'Smartphone', docs: 'IMEI Cert, Purchase Receipt', status: 'Active', icon: Smartphone },
    { class: 'Laptop', docs: 'Serial Check, Warranty Doc', status: 'Active', icon: Laptop },
    { class: 'Vehicle', docs: 'Original Logbook, Insurance Policy', status: 'Inactive', icon: Car }
  ]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleUpdateFinancials = (e) => {
    e.preventDefault();
    showToast('Financial parameters updated successfully.');
  };

  const handleSavePermissions = () => {
    showToast('Permissions configuration synchronized.');
  };

  return (
    <div>
      {/* Toast banner */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          backgroundColor: '#0f172a',
          color: 'white',
          padding: '1rem 1.5rem',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
          zIndex: 9999,
          animation: 'slideUp 0.3s ease-out'
        }}>
          <CheckCircle size={20} color="var(--color-success)" />
          <div>
            <strong style={{ fontSize: '0.85rem', display: 'block' }}>Changes Saved</strong>
            <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>System Settings</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          Manage global variables, user permissions, and collateral parameters.
        </p>
      </div>

      {/* 2-Column Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1.2fr',
        gap: '2rem',
        alignItems: 'start'
      }}>
        {/* Left Column: Asset categories & users */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Collateral types */}
          <div className="card" style={{ margin: 0, padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 className="card-title" style={{ fontSize: '1rem' }}>Collateral Type Management</h3>
                <span className="card-subtitle">Define and manage valid asset types for loan backing</span>
              </div>
              <button
                onClick={() => alert('New asset category creation requested.')}
                className="btn btn-primary btn-small"
                style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}
              >
                <Plus size={14} /> Add New Type
              </button>
            </div>

            <div className="table-wrapper" style={{ border: '1px solid var(--border-color-dark)', borderRadius: '6px' }}>
              <table className="custom-table">
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc' }}>
                    <th>Asset Class</th>
                    <th>Required Documentation</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {collaterals.map((asset) => {
                    const Icon = asset.icon;
                    return (
                      <tr key={asset.class}>
                        <td style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Icon size={16} color="var(--color-primary)" /> {asset.class}
                        </td>
                        <td style={{ color: 'var(--text-secondary)' }}>{asset.docs}</td>
                        <td>
                          <span className={`badge ${asset.status === 'Active' ? 'success' : 'warning'}`}>
                            {asset.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            onClick={() => alert(`Editing documentation parameters for ${asset.class}`)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                          >
                            <Edit size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Users & role management */}
          <div className="card" style={{ margin: 0, padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 className="card-title" style={{ fontSize: '1rem' }}>User &amp; Role Management</h3>
                <span className="card-subtitle">Manage administrative access and permissions</span>
              </div>
              <button
                onClick={() => setIsStaffModalOpen(true)}
                className="btn btn-outline btn-small"
                style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}
              >
                <UserPlus size={14} /> Add Staff Member
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {users.map((u) => {
                const initials = u.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                const color = u.role === 'System Admin' ? 'var(--color-danger)' : 'var(--color-primary)';
                return (
                  <div
                    key={u.id || u.email}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                      padding: '1rem',
                      border: '1px solid var(--border-color-dark)',
                      backgroundColor: '#ffffff',
                      borderRadius: 'var(--radius-md)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: color,
                          color: 'white',
                          fontWeight: '700',
                          fontSize: '0.8rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {initials}
                        </div>
                        <div>
                          <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)' }}>{u.name}</h4>
                          <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{u.role} &bull; {u.email}</p>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.65rem', backgroundColor: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: '700', color: '#475569' }}>
                        ID: {u.id ? u.id.split('-').pop() : 'DEFAULT'}
                      </span>
                    </div>

                    {/* Delegated Permissions Tags */}
                    {u.permissions && u.permissions.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
                        {u.permissions.map(p => (
                          <span key={p} style={{ fontSize: '0.6rem', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', padding: '0.1rem 0.35rem', borderRadius: '3px', fontWeight: '600' }}>
                            {p.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Add Staff / Role Delegation Modal */}
        {isStaffModalOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            animation: 'fadeIn 0.25s ease-out'
          }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '520px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              overflow: 'hidden',
              border: '1px solid var(--border-color)',
              fontFamily: 'Inter, sans-serif'
            }}>
              {/* Modal Header */}
              <div style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#f8fafc'
              }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)' }}>Add Staff & Delegate Permissions</h3>
                <button 
                  onClick={() => setIsStaffModalOpen(false)}
                  style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  &times;
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleAddStaffSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.375rem' }}>
                    Staff Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={staffName}
                    onChange={(e) => setStaffName(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.375rem' }}>
                    Login Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. j.doe@institution.com"
                    value={staffEmail}
                    onChange={(e) => setStaffEmail(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.375rem' }}>
                    Access Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Minimum 6 characters"
                    value={staffPassword}
                    onChange={(e) => setStaffPassword(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.375rem' }}>
                    Access Role
                  </label>
                  <select
                    value={staffRole}
                    onChange={(e) => setStaffRole(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem', cursor: 'pointer' }}
                  >
                    <option value="Loan Officer">Loan Officer / Staff</option>
                    <option value="System Admin">System Admin / Institutional Admin</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Delegate Permissions & Tasks
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    {[
                      { key: 'apply_loans', label: 'Apply for Loans (Book clients)' },
                      { key: 'disburse_loans', label: 'Disburse Capital (Release funds)' },
                      { key: 'edit_loans', label: 'Edit Loan Records (Modify parameters)' },
                      { key: 'send_reminders', label: 'Send Overdue Reminders (Email/SMS)' },
                      { key: 'view_analytics', label: 'View Analytical Reports & Portfolios' }
                    ].map(p => (
                      <label key={p.key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', cursor: 'pointer', color: 'var(--text-primary)' }}>
                        <input
                          type="checkbox"
                          checked={staffPerms[p.key]}
                          onChange={(e) => setStaffPerms({ ...staffPerms, [p.key]: e.target.checked })}
                          style={{ cursor: 'pointer' }}
                        />
                        {p.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button 
                    type="button" 
                    onClick={() => setIsStaffModalOpen(false)}
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
                    Create & Delegate
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Right Column: Financial params & logs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Financial variables */}
          <div className="card" style={{ margin: 0, padding: '1.5rem' }}>
            <h3 className="card-title" style={{ fontSize: '0.95rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
              Financial Parameters
            </h3>
            
            <form onSubmit={handleUpdateFinancials} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '0.375rem', textTransform: 'uppercase' }}>
                  CURRENCY SETTING
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid var(--border-color-dark)',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    backgroundColor: '#f8fafc',
                    outline: 'none'
                  }}
                >
                  <option value="Rwandan Franc (RWF)">Rwandan Franc (RWF)</option>
                  <option value="US Dollar (USD)">US Dollar (USD)</option>
                  <option value="Kenyan Shilling (KES)">Kenyan Shilling (KES)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '0.375rem', textTransform: 'uppercase' }}>
                  SYSTEM LANGUAGE
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid var(--border-color-dark)',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    backgroundColor: '#f8fafc',
                    outline: 'none'
                  }}
                >
                  <option value="English">English</option>
                  <option value="French">French</option>
                  <option value="Kinyarwanda">Kinyarwanda</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '0.375rem', textTransform: 'uppercase' }}>
                  STANDARD APR (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={apr}
                  onChange={(e) => setApr(parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid var(--border-color-dark)',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    backgroundColor: '#f8fafc',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '0.375rem', textTransform: 'uppercase' }}>
                  LATE FEE PERCENTAGE (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={lateFee}
                  onChange={(e) => setLateFee(parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid var(--border-color-dark)',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    backgroundColor: '#f8fafc',
                    outline: 'none'
                  }}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                Update Variables
              </button>
            </form>
          </div>

          {/* System configurations */}
          <div className="card" style={{ margin: 0, padding: '1.5rem' }}>
            <h3 className="card-title" style={{ fontSize: '0.95rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
              System Configurations
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '0.8rem', fontWeight: '700' }}>Email Notifications</h4>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Send alerts on status changes</p>
                </div>
                <input type="checkbox" defaultChecked style={{ cursor: 'pointer' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '0.8rem', fontWeight: '700' }}>Push Notifications</h4>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Alert mobile borrowers</p>
                </div>
                <input type="checkbox" style={{ cursor: 'pointer' }} />
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '0.375rem', textTransform: 'uppercase' }}>
                  DATA BACKUP SCHEDULE
                </label>
                <select style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color-dark)', borderRadius: '4px', fontSize: '0.8rem', backgroundColor: '#f8fafc', outline: 'none' }}>
                  <option>Every 24 Hours</option>
                  <option>Weekly (Sundays)</option>
                  <option>Manual Only</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => alert('Downloading system audit logs (CSV format)...')}
              className="btn btn-outline"
              style={{ width: '100%', marginTop: '1.25rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.375rem' }}
            >
              <Download size={14} /> Download Audit Logs
            </button>
          </div>

          {/* Branding */}
          <div className="card" style={{ margin: 0, padding: '1.5rem', borderTop: '4px solid var(--color-primary)' }}>
            <h3 className="card-title" style={{ fontSize: '0.95rem', marginBottom: '1rem' }}>Platform Branding</h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color-dark)' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '4px',
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Shield size={18} />
              </div>
              <div>
                <strong style={{ fontSize: '0.8rem', color: 'var(--text-primary)', display: 'block' }}>Current Logo</strong>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Sentinel_Shield_V2.svg</span>
              </div>
            </div>

            <button
              onClick={() => alert('Triggering file upload dialog...')}
              className="btn btn-outline"
              style={{ width: '100%', borderStyle: 'dashed', marginTop: '1rem' }}
            >
              Upload New Branding
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
