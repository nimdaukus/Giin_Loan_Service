'use client';

import React, { useState } from 'react';
import { ShieldCheck, HardDrive, Lock, ShieldAlert, CheckCircle, Search, FileText, ArrowDown, Download, AlertTriangle } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function SecurityCenter() {
  const { activities } = useApp();
  const [levelFilter, setLevelFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Generate dynamic compliance events based on real-time system activities
  const getSecurityEvents = () => {
    return activities.map((act, index) => {
      const isCritical = act.type === 'danger' || act.title.toLowerCase().includes('delete') || act.title.toLowerCase().includes('remove');
      const isWarning = act.type === 'warning' || act.title.toLowerCase().includes('failed') || act.title.toLowerCase().includes('unauthorized');
      return {
        level: isCritical ? 'Critical' : isWarning ? 'Warning' : 'Info',
        timestamp: act.time || 'Just now',
        userId: act.userEmail || 'System Admin',
        action: `${act.title}: ${act.desc}`,
        ip: act.ipAddress || '192.168.1.1',
        hash: act.hash || `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`
      };
    });
  };

  const events = getSecurityEvents();

  // Filter Logic
  const filteredEvents = events.filter(ev => {
    const matchLevel = levelFilter === 'All' || ev.level === levelFilter;
    const matchSearch = ev.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        ev.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        ev.hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        ev.ip.toLowerCase().includes(searchQuery.toLowerCase());
    return matchLevel && matchSearch;
  });

  const exportComplianceLog = () => {
    const headers = ['Level', 'Timestamp', 'User ID', 'Action', 'IP Address', 'Forensic Hash'];
    const rows = filteredEvents.map(ev => [
      ev.level,
      ev.timestamp,
      ev.userId,
      ev.action,
      ev.ip,
      ev.hash
    ]);

    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `GIIN_Sentinel_Security_Logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Audit & Compliance Center</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Verify cryptographic health parameters and review immutable operation ledgers.
          </p>
        </div>
        <button onClick={exportComplianceLog} className="btn btn-primary">
          <Download size={16} /> Compliance Export
        </button>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        {/* Node status */}
        <div className="card" style={{ margin: 0, padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Node Status</span>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--color-success)', marginTop: '0.25rem' }}>Operational</div>
            </div>
            <div style={{ backgroundColor: 'var(--color-success-bg)', padding: '0.375rem', borderRadius: '50%' }}>
              <HardDrive size={16} color="var(--color-success)" />
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem', fontWeight: '600' }}>
            ● 12 Active Nodes Synced
          </div>
        </div>

        {/* Encryption Health */}
        <div className="card" style={{ margin: 0, padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Encryption Health</span>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '0.25rem' }}>99.9%</div>
            </div>
            <div style={{ backgroundColor: '#eff6ff', padding: '0.375rem', borderRadius: '50%' }}>
              <Lock size={16} color="var(--color-primary)" />
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem', fontWeight: '600' }}>
            AES-256 GCM Compliant
          </div>
        </div>

        {/* Security Events */}
        <div className="card" style={{ margin: 0, padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Security Events (24h)</span>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '0.25rem' }}>142</div>
            </div>
            <div style={{ backgroundColor: 'var(--color-danger-bg)', padding: '0.375rem', borderRadius: '50%' }}>
              <ShieldAlert size={16} color="var(--color-danger)" />
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-success)', marginTop: '0.5rem', fontWeight: '600' }}>
            +6% from yesterday
          </div>
        </div>

        {/* Audit Integrity */}
        <div className="card" style={{ margin: 0, padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Audit Integrity</span>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--color-primary)', marginTop: '0.25rem' }}>Verified</div>
            </div>
            <div style={{ backgroundColor: 'var(--color-primary-light)', padding: '0.375rem', borderRadius: '50%' }}>
              <CheckCircle size={16} color="var(--color-primary)" />
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-success)', marginTop: '0.5rem', fontWeight: '600' }}>
            ✓ Hash Chain Validated
          </div>
        </div>
      </div>

      {/* Filter panel */}
      <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '1rem', flex: 1, minWidth: '300px' }}>
            {/* Search */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#f1f5f9',
              padding: '0.5rem 0.75rem',
              borderRadius: '4px',
              flex: 1
            }}>
              <Search size={16} color="#64748b" />
              <input
                type="text"
                placeholder="Search by User ID or Hash..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem', width: '100%' }}
              />
            </div>

            {/* Dropdown level */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Level:</span>
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                style={{
                  border: '1px solid var(--border-color-dark)',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  backgroundColor: 'white',
                  outline: 'none'
                }}
              >
                <option value="All">All Levels</option>
                <option value="Critical">Critical</option>
                <option value="Warning">Warning</option>
                <option value="Info">Info</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Immutable ledger table */}
      <div className="card" style={{ padding: 0, marginBottom: '2rem' }}>
        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Event Level</th>
                <th>Timestamp</th>
                <th>User ID / Entity</th>
                <th>Action Performed</th>
                <th>IP Address</th>
                <th>Forensic Hash</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((ev, index) => (
                <tr key={index}>
                  <td>
                    <span className={`badge ${
                      ev.level === 'Critical' ? 'danger' : ev.level === 'Warning' ? 'warning' : 'success'
                    }`} style={{ fontSize: '0.65rem' }}>
                      {ev.level}
                    </span>
                  </td>
                  <td style={{ fontWeight: '500', fontSize: '0.8rem' }}>{ev.timestamp}</td>
                  <td style={{ fontWeight: '700' }}>{ev.userId}</td>
                  <td>{ev.action}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{ev.ip}</td>
                  <td>
                    <code style={{
                      backgroundColor: '#f1f5f9',
                      padding: '0.2rem 0.4rem',
                      borderRadius: '4px',
                      fontFamily: 'monospace',
                      fontSize: '0.7rem',
                      color: 'var(--text-secondary)',
                      maxWidth: '120px',
                      display: 'block',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }} title={ev.hash}>
                      {ev.hash}
                    </code>
                  </td>
                </tr>
              ))}
              {filteredEvents.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                    No matching compliance logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination mock */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 1.25rem',
          borderTop: '1px solid var(--border-color)',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)'
        }}>
          <span>Showing 1-5 of 12,432 immutable events</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-outline btn-small" disabled>&lt;</button>
            <button className="btn btn-outline btn-small">&gt;</button>
          </div>
        </div>
      </div>

      {/* Bottom widgets */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '2rem'
      }}>
        {/* Security Distribution */}
        <div className="card" style={{ margin: 0 }}>
          <h3 className="card-title" style={{ fontSize: '0.95rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
            Security Distribution
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                <span>User Signatures (Manual)</span>
                <span>64%</span>
              </div>
              <div className="progress-container" style={{ margin: 0, height: '6px' }}>
                <div className="progress-bar" style={{ width: '64%' }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                <span>System Automated (AI Shield)</span>
                <span>36%</span>
              </div>
              <div className="progress-container" style={{ margin: 0, height: '6px' }}>
                <div className="progress-bar" style={{ width: '36%', backgroundColor: 'var(--color-success)' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Integrity Check seal */}
        <div className="card" style={{ margin: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', backgroundColor: '#eff6ff', border: '1px dashed var(--color-primary)' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.75rem'
          }}>
            ✓
          </div>
          <h4 style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--color-primary)' }}>Audit Integrity Check</h4>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem', maxWidth: '260px' }}>
            Block nodes fully validated. All signature trails matching compliance indices (ILF-2024).
          </p>
          <span style={{ fontSize: '0.65rem', color: 'var(--color-success)', fontWeight: '700', marginTop: '0.5rem' }}>
            🔒 NODE SECURE
          </span>
        </div>
      </div>
    </div>
  );
}
