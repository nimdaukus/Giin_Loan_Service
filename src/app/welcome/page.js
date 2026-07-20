'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Eye, Settings, HelpCircle, ArrowRight, CheckCircle, Database, Lock, Globe, Mail, Share } from 'lucide-react';

export default function WelcomeLandingPage() {
  const router = useRouter();

  return (
    <div style={{
      backgroundColor: '#fcf8fa',
      color: '#1b1b1d',
      fontFamily: 'Inter, sans-serif',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Navigation Header */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '64px',
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #e2e8f0',
        padding: '0 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <strong style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            GIIN Sentinel
          </strong>
        </div>

        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <a href="#" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Home</a>
          <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Platform</a>
          <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Security</a>
          <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>About</a>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => router.push('/login')}
            className="btn btn-outline"
            style={{ padding: '0.5rem 1.25rem', fontSize: '0.75rem', fontWeight: '700' }}
          >
            Login
          </button>
          <button
            onClick={() => router.push('/signup')}
            className="btn btn-primary"
            style={{ padding: '0.5rem 1.5rem', fontSize: '0.75rem', fontWeight: '700', boxShadow: '0 4px 10px rgba(0, 81, 213, 0.2)' }}
          >
            Apply Now
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <main style={{ marginTop: '64px', flex: 1 }}>
        {/* Hero Section */}
        <section style={{
          backgroundColor: '#131b2e',
          color: 'white',
          padding: '6rem 2rem',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          minHeight: '640px'
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle at top right, rgba(0, 81, 213, 0.15) 0%, transparent 60%)',
            pointerEvents: 'none'
          }}></div>

          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '4rem',
            alignItems: 'center',
            position: 'relative',
            zIndex: 10
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(0, 81, 213, 0.15)',
                border: '1px solid rgba(0, 81, 213, 0.3)',
                padding: '0.375rem 0.75rem',
                borderRadius: '50px',
                width: 'fit-content'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }}></span>
                <span style={{ fontSize: '0.65rem', fontWeight: '800', color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Institutional Grade Infrastructure
                </span>
              </div>

              <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'white', lineHeight: '1.2', letterSpacing: '-0.02em' }}>
                Empowering Future Leaders through Institutional Finance
              </h1>
              
              <p style={{ fontSize: '0.95rem', color: '#94a3b8', lineHeight: '1.6', maxWidth: '480px' }}>
                GIIN Sentinel bridges the gap between traditional credit structures and modern educational aspirations. Secure, transparent, and built for scale.
              </p>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                  onClick={() => router.push('/signup')}
                  className="btn btn-primary"
                  style={{
                    padding: '1rem 1.75rem',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 12px rgba(0, 81, 213, 0.3)'
                  }}
                >
                  Start Application <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => alert('Viewing platform details...')}
                  className="btn btn-outline"
                  style={{ padding: '1rem 1.75rem', fontSize: '0.85rem', fontWeight: '700', color: 'white', borderColor: 'rgba(255, 255, 255, 0.2)' }}
                >
                  View Platform
                </button>
              </div>
            </div>

            {/* Right mock image card */}
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                top: '-40px',
                left: '-40px',
                width: '160px',
                height: '160px',
                backgroundColor: 'rgba(0, 81, 213, 0.1)',
                borderRadius: '50%',
                filter: 'blur(40px)',
                zIndex: 1
              }}></div>

              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                position: 'relative',
                zIndex: 10
              }}>
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwpqWDbzXHNqtwoeiKlV3G7_ezHfOoUKI9tk5qBfuNxn3UpdtyV-YdoQMqHxeVPlVL5ETCpPZmXRO2EzXqbDDPrWZk0edRoLFRICrAYxqnj0ffus0LAlRcoigs6A2gbaZL25oS6Fmec6zEIeycEzDEIOcvY5a63eX6NfX-QBwc8dr1eeCsuHe1VUsNiZBPCOBVw8yllQ9bu8Bq9jQO0pXtCVpFpDG0jl6KwMWIujHbuHV273NqoXKc7WnQf7rSH_s0vDmY50q_EI69"
                  alt="Financial headquarters"
                  style={{ width: '100%', height: '340px', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '1.5rem',
                  left: '1.5rem',
                  right: '1.5rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  padding: '1.25rem',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-success-bg)',
                      color: 'var(--color-success)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      ✓
                    </div>
                    <div>
                      <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase' }}>SECURE DISBURSEMENT</span>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)', display: 'block' }}>$124.5M Managed</strong>
                    </div>
                  </div>
                  <div className="progress-container" style={{ margin: 0, height: '6px' }}>
                    <div className="progress-bar" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pillars / Value propositions */}
        <section style={{ padding: '6rem 2rem', backgroundColor: '#ffffff' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 4rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '1rem' }}>
                Redefining Loan Management
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Our infrastructure is designed for high-density data and absolute precision, ensuring institutional trust at every touchpoint.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem'
            }}>
              {/* Card 1 */}
              <div style={{ padding: '2.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyCenter: 'center', marginBottom: '1.5rem', justifyContent: 'center' }}>
                  <Eye size={20} color="var(--color-primary)" />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.75rem' }}>Transparent Terms</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  Full visibility into fee structures and repayment schedules. No hidden clauses, just clear, database-verified documentation.
                </p>
              </div>

              {/* Card 2 */}
              <div style={{ padding: '2.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--color-success-bg)', display: 'flex', alignItems: 'center', justifyCenter: 'center', marginBottom: '1.5rem', justifyContent: 'center' }}>
                  <Shield size={20} color="var(--color-success)" />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.75rem' }}>Collateral-Backed</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  Robust risk mitigation through diverse collateral pools, monitored 24/7 by our automated sentinel system.
                </p>
              </div>

              {/* Card 3 */}
              <div style={{ padding: '2.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--color-warning-bg)', display: 'flex', alignItems: 'center', justifyCenter: 'center', marginBottom: '1.5rem', justifyContent: 'center' }}>
                  <Settings size={20} color="var(--color-warning)" />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.75rem' }}>Automated Management</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  Streamlined lifecycle tracking from application to final repayment, powered by smart logs to eliminate manual friction.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section style={{ padding: '6rem 2rem', backgroundColor: '#f8fafc' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 4rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '1rem' }}>
                Your Journey to Growth
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                A streamlined three-step process designed for the modern borrower.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', position: 'relative' }}>
              {/* Step 1 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: 'var(--color-primary)', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                  01
                </div>
                <h4 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '0.5rem' }}>Apply</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  Submit your application and collateral details through our secure portal.
                </p>
              </div>

              {/* Step 2 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: 'var(--color-primary)', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                  02
                </div>
                <h4 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '0.5rem' }}>Review</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  Institutional admins verify collateral details via GIIN Sentinel's automated center.
                </p>
              </div>

              {/* Step 3 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: 'var(--color-primary)', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                  03
                </div>
                <h4 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '0.5rem' }}>Repay</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  Track your progress and automate repayments via our tracker dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', padding: '4rem 2rem 2.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '2.5rem', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '2rem' }}>
            <div>
              <span style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--text-primary)' }}>GIIN Sentinel</span>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem', maxWidth: '300px', lineHeight: '1.5' }}>
                The world&apos;s first decentralized institutional loan platform for education and personal growth.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backgroundColor: 'transparent' }}>
                <Globe size={16} />
              </button>
              <button style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backgroundColor: 'transparent' }}>
                <Mail size={16} />
              </button>
              <button style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backgroundColor: 'transparent' }}>
                <Share size={16} />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)', flexWrap: 'wrap', gap: '1rem' }}>
            <span>© 2024 GIIN Sentinel. All rights reserved.</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Lock size={12} color="var(--color-success)" /> AES-256 BANK GRADE ENCRYPTION
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
