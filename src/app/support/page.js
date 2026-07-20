'use client';

import React, { useState } from 'react';
import { Search, BookOpen, ExternalLink, ShieldCheck, Cpu, Database, Layout, Sparkles, MessageCircle, X } from 'lucide-react';

export default function SupportCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Welcome to Sentinel Operations Support. How can I assist you with collateral checks or protocol audits today?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    alert(`Searching support logs for: "${searchQuery}"`);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsgs = [...chatMessages, { sender: 'user', text: chatInput }];
    setChatMessages(newMsgs);
    setChatInput('');

    // Simulate bot response
    setTimeout(() => {
      let reply = "Understood. Sentinel Ops protocols are governed by ISO 27001 standard frameworks. Please check the 'Collateral Guidelines' or contact System Admin.";
      if (chatInput.toLowerCase().includes('collateral') || chatInput.toLowerCase().includes('laptop') || chatInput.toLowerCase().includes('marcus')) {
        reply = "Marcus Thorne's tech collateral records can be audited in the Approval Center page, or inspected under our Collateral Inspection dashboard.";
      } else if (chatInput.toLowerCase().includes('password') || chatInput.toLowerCase().includes('login') || chatInput.toLowerCase().includes('reset')) {
        reply = "Password recovery links can be generated via the /password-recovery page, and validated with a 6-digit OTP code on the verification gateway.";
      }
      setChatMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    }, 800);
  };

  return (
    <div style={{ position: 'relative', minHeight: 'calc(100vh - 120px)' }}>
      {/* Page Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Support Center</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Access security documentation, operation manuals, and audit frameworks.
          </p>
        </div>
      </div>

      {/* Main Search Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '3rem 2rem',
        textAlign: 'center',
        color: 'white',
        boxShadow: 'var(--shadow-md)',
        marginBottom: '2rem'
      }}>
        <h2 style={{ fontSize: '1.85rem', fontWeight: '800', marginBottom: '0.5rem' }}>
          How can we assist your operations?
        </h2>
        <p style={{ fontSize: '0.95rem', color: '#bfdbfe', marginBottom: '1.75rem' }}>
          Search across loan protocols, security documentation, and system manuals.
        </p>
        
        <form onSubmit={handleSearchSubmit} style={{
          maxWidth: '600px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'white',
          borderRadius: 'var(--radius-md)',
          padding: '0.375rem 0.75rem',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <Search size={20} color="#64748b" style={{ marginRight: '0.5rem' }} />
          <input
            type="text"
            placeholder="Search documentation, updates, or protocol codes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              width: '100%',
              fontSize: '0.95rem',
              color: 'var(--text-primary)',
              padding: '0.5rem 0'
            }}
          />
        </form>
      </div>

      {/* 2x2 Grid Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '2rem'
      }}>
        {/* Card 1: Loan Processing */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', margin: 0 }}>
          <div className="card-header" style={{ paddingBottom: '0.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={18} color="var(--color-primary)" />
                <h3 className="card-title">Loan Processing</h3>
              </div>
              <span className="card-subtitle">Lifecycle management from intake to final disbursement</span>
            </div>
            <span className="badge success" style={{ fontSize: '0.65rem' }}>PRIORITY</span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginTop: '1.25rem'
          }}>
            {[
              { title: 'Disbursement Protocols', desc: 'Step-by-step wire transfer safety rules.' },
              { title: 'KYC Verification Logic', desc: 'Automated vs Manual checks parameters.' },
              { title: 'Approval Hierarchies', desc: 'Manager override threshold limits.' },
              { title: 'Post-Funding Audits', desc: 'Compliance documentation review guides.' }
            ].map((item, idx) => (
              <div key={idx} style={{
                padding: '1rem',
                backgroundColor: '#f8fafc',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                transition: 'var(--transition-fast)'
              }} className="support-sub-card">
                <div style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-primary)' }}>{item.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Collateral Guidelines */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', margin: 0 }}>
          <div className="card-header" style={{ paddingBottom: '0.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Database size={18} color="var(--color-primary)" />
                <h3 className="card-title">Collateral Guidelines</h3>
              </div>
              <span className="card-subtitle">Standardized asset valuation and verification methods</span>
            </div>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            marginTop: '1.25rem',
            flex: 1
          }}>
            {[
              { name: 'Valuation API Reference', path: '/approval-center/collateral-verification' },
              { name: 'Acceptable Assets List', path: '#' },
              { name: 'Lien Registration Flow', path: '#' }
            ].map((link, idx) => (
              <a
                href={link.path}
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem 1.25rem',
                  border: '1px solid var(--border-color-dark)',
                  borderRadius: 'var(--radius-sm)',
                  textDecoration: 'none',
                  color: 'var(--text-primary)',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  backgroundColor: '#ffffff',
                  transition: 'var(--transition-fast)'
                }}
                className="support-link-item"
              >
                <span>{link.name}</span>
                <ExternalLink size={16} color="var(--text-secondary)" />
              </a>
            ))}
          </div>
        </div>

        {/* Card 3: Security Protocols */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', margin: 0 }}>
          <div className="card-header" style={{ paddingBottom: '0.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={18} color="var(--color-primary)" />
                <h3 className="card-title">Security Protocols</h3>
              </div>
              <span className="card-subtitle">Mandatory administrative security requirements</span>
            </div>
          </div>
          
          <div style={{
            marginTop: '1.25rem',
            backgroundColor: '#fffbeb',
            border: '1px solid #fef3c7',
            borderRadius: 'var(--radius-sm)',
            padding: '1rem 1.25rem',
            color: '#92400e',
            fontSize: '0.85rem',
            lineHeight: '1.6'
          }}>
            <strong>ALERT:</strong> All administrative recoveries require physical biometric tokens and multi-party cryptographic signatures.
            If you suspect node vulnerability, trigger the lock security node function immediately under user management.
          </div>

          <p style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginTop: '1rem',
            textAlign: 'center'
          }}>
            Sentinel system operates under AES-256 standard protocols.
          </p>
        </div>

        {/* Card 4: System Updates */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', margin: 0 }}>
          <div className="card-header" style={{ paddingBottom: '0.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Cpu size={18} color="var(--color-primary)" />
                <h3 className="card-title">System Updates</h3>
              </div>
              <span className="card-subtitle">Version 2.4.1 - &quot;Sentinel Shield&quot;</span>
            </div>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginTop: '1.25rem'
          }}>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-success)',
                marginTop: '0.375rem',
                flexShrink: 0
              }}></span>
              <div>
                <strong style={{ fontSize: '0.85rem', display: 'block' }}>New: Automated Appraisal Engine</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Real-estate collateral now auto-syncs with national tax valuation indices.
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)',
                marginTop: '0.375rem',
                flexShrink: 0
              }}></span>
              <div>
                <strong style={{ fontSize: '0.85rem', display: 'block' }}>Improvement: Dash Performance</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Reduced load times for the Portfolio ledger logs by 40% using lazy-loaded queries.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chat Widget */}
      <div style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 9999
      }}>
        {isChatOpen ? (
          <div style={{
            width: '320px',
            height: '420px',
            backgroundColor: 'white',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-color-dark)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Chat header */}
            <div style={{
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              padding: '0.75rem 1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontWeight: '700', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Sparkles size={14} /> Sentinel Operations AI
              </span>
              <button
                onClick={() => setIsChatOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Chat Messages */}
            <div style={{
              flex: 1,
              padding: '1rem',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              backgroundColor: '#f8fafc'
            }}>
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    backgroundColor: msg.sender === 'user' ? 'var(--color-primary)' : '#e2e8f0',
                    color: msg.sender === 'user' ? 'white' : 'var(--text-primary)',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    maxWidth: '80%',
                    lineHeight: '1.4'
                  }}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Chat input */}
            <form onSubmit={handleSendMessage} style={{
              padding: '0.5rem',
              borderTop: '1px solid var(--border-color-dark)',
              display: 'flex',
              gap: '0.5rem',
              backgroundColor: 'white'
            }}>
              <input
                type="text"
                placeholder="Ask about collateral or resets..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.375rem 0.75rem',
                  fontSize: '0.75rem',
                  border: '1px solid var(--border-color-dark)',
                  borderRadius: '4px',
                  outline: 'none'
                }}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}>
                Send
              </button>
            </form>
          </div>
        ) : (
          <button
            onClick={() => setIsChatOpen(true)}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-lg)',
              transition: 'var(--transition-fast)'
            }}
            className="chatbot-btn"
            title="Open Sentinel Operations Chatbot"
          >
            <MessageCircle size={24} />
          </button>
        )}
      </div>
    </div>
  );
}
