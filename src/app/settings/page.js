'use client';

import React, { useState } from 'react';
import { Smartphone, Laptop, Car, Plus, Edit, UserPlus, Save, CheckCircle, Download, Shield } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function SettingsPortal() {
  const { currency, setCurrency, language, setLanguage, currentUser } = useApp();
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

  // Collateral categories state
  const [collaterals, setCollaterals] = useState([
    { class: 'Smartphone', docs: 'IMEI Cert, Purchase Receipt', status: 'Active', icon: Smartphone },
    { class: 'Laptop', docs: 'Serial Check, Warranty Doc', status: 'Active', icon: Laptop },
    { class: 'Vehicle', docs: 'Original Logbook, Insurance Policy', status: 'Inactive', icon: Car }
  ]);

  // Team users state
  const [users, setUsers] = useState([
    { name: 'Jean Damascene', role: 'Institutional Admin', initials: 'JD', color: 'var(--color-success)' },
    { name: 'Marie Kaliza', role: 'Reviewer', initials: 'MK', color: 'var(--color-primary)' }
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
                onClick={() => alert('Adding new team member invites...')}
                className="btn btn-outline btn-small"
                style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}
              >
                <UserPlus size={14} /> Invite User
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {users.map((u) => (
                <div
                  key={u.name}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem 1rem',
                    border: '1px solid var(--border-color-dark)',
                    backgroundColor: '#ffffff',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: u.color,
                      color: 'white',
                      fontWeight: '700',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {u.initials}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)' }}>{u.name}</h4>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{u.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => alert(`Modifying clearance levels for ${u.name}`)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                  >
                    ⚙
                  </button>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <button onClick={handleSavePermissions} className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>
                Save Permissions
              </button>
            </div>
          </div>
        </div>

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
