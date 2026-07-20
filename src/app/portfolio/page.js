'use client';

import React, { useState } from 'react';
import { DollarSign, Activity, FileText, Cpu, AlertTriangle, ShieldCheck, Play, CheckCircle } from 'lucide-react';

export default function RiskLiquidityHub() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [heatmapToggle, setHeatmapToggle] = useState('region'); // 'region' | 'collateral'
  
  // Stress Simulation states
  const [interestShift, setInterestShift] = useState(2.5);
  const [ltvDrop, setLtvDrop] = useState(15);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simResults, setSimResults] = useState(null);

  // Mock heatmap cell data (By Region vs By Collateral)
  const regionHeatmap = [
    [ { val: '12%', color: '#d1fae5', text: '#065f46' }, { val: '', color: '#f8fafc' }, { val: '42%', color: '#fee2e2', text: '#991b1b' }, { val: '', color: '#f8fafc' }, { val: '', color: '#f8fafc' } ],
    [ { val: '', color: '#f8fafc' }, { val: '88%', color: '#fca5a5', text: '#7f1d1d' }, { val: '', color: '#f8fafc' }, { val: '22%', color: '#fef3c7', text: '#92400e' }, { val: '', color: '#f8fafc' } ],
    [ { val: '', color: '#f8fafc' }, { val: '', color: '#f8fafc' }, { val: '15%', color: '#d1fae5', text: '#065f46' }, { val: '', color: '#f8fafc' }, { val: '65%', color: '#fde68a', text: '#78350f' } ],
    [ { val: 'Target Zone', color: '#dbeafe', text: '#1e40af', isSpan: true }, { val: '', color: '#f8fafc' }, { val: '', color: '#f8fafc' }, { val: '', color: '#f8fafc' } ]
  ];

  const collateralHeatmap = [
    [ { val: '5%', color: '#d1fae5', text: '#065f46' }, { val: '', color: '#f8fafc' }, { val: '55%', color: '#fde68a', text: '#78350f' }, { val: '', color: '#f8fafc' }, { val: '', color: '#f8fafc' } ],
    [ { val: '', color: '#f8fafc' }, { val: '20%', color: '#d1fae5', text: '#065f46' }, { val: '', color: '#f8fafc' }, { val: '72%', color: '#fee2e2', text: '#991b1b' }, { val: '', color: '#f8fafc' } ],
    [ { val: '', color: '#f8fafc' }, { val: '', color: '#f8fafc' }, { val: '45%', color: '#fca5a5', text: '#7f1d1d' }, { val: '', color: '#f8fafc' }, { val: '10%', color: '#d1fae5', text: '#065f46' } ],
    [ { val: 'Target Zone', color: '#dbeafe', text: '#1e40af', isSpan: true }, { val: '', color: '#f8fafc' }, { val: '', color: '#f8fafc' }, { val: '', color: '#f8fafc' } ]
  ];

  const activeHeatmap = heatmapToggle === 'region' ? regionHeatmap : collateralHeatmap;

  const runSimulation = (e) => {
    e.preventDefault();
    setIsSimulating(true);
    setSimResults(null);
    
    setTimeout(() => {
      setIsSimulating(false);
      // Calculate mock results based on values
      const hit = Math.round((interestShift * 0.4 + ltvDrop * 0.8) * 10) / 10;
      setSimResults({
        exposureRiskHit: `${hit}% Increase`,
        liquidityDrain: `$${(hit * 12.5).toFixed(1)}M Projected Outflow`,
        action: hit > 10 ? 'ALERT: Capital Buffer Injection Needed' : 'PASS: Reserve Buffer Sufficient'
      });
    }, 1500);
  };

  return (
    <div>
      {/* Header and Sub-tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Portfolio Analytics</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Risk assessment matrices, liquidity thresholds, and stress simulation modeling.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#e2e8f0', padding: '0.25rem', borderRadius: '6px' }}>
          {['Overview', 'Risk Metrics', 'Stress Tests'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                border: 'none',
                background: activeTab === tab ? '#ffffff' : 'transparent',
                color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: '600',
                fontSize: '0.8rem',
                padding: '0.375rem 0.75rem',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'var(--transition-fast)'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="metric-cards-container" style={{ marginBottom: '2rem' }}>
        <div className="metric-card">
          <div className="metric-card-header">
            <span className="metric-card-title">Total Exposure</span>
            <div style={{ backgroundColor: '#eff6ff', padding: '0.375rem', borderRadius: '50%' }}>
              <DollarSign size={16} color="var(--color-primary)" />
            </div>
          </div>
          <div className="metric-value">$1.42B</div>
          <div className="metric-change up">
            <span>+3.2% vs Last Quarter</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-card-header">
            <span className="metric-card-title">Portfolio Health</span>
            <div style={{ backgroundColor: '#d1fae5', padding: '0.375rem', borderRadius: '50%' }}>
              <ShieldCheck size={16} color="var(--color-success)" />
            </div>
          </div>
          <div className="metric-value">94.8%</div>
          <div className="metric-change up" style={{ backgroundColor: '#d1fae5', color: '#065f46' }}>
            <span>Standard Low Risk Level</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-card-header">
            <span className="metric-card-title">System Latency</span>
            <div style={{ backgroundColor: '#eff6ff', padding: '0.375rem', borderRadius: '50%' }}>
              <Cpu size={16} color="var(--color-primary)" />
            </div>
          </div>
          <div className="metric-value">12ms</div>
          <div style={{ display: 'flex', gap: '2px', marginTop: '0.5rem' }}>
            <div style={{ height: '3px', flex: 1, backgroundColor: 'var(--color-success)' }}></div>
            <div style={{ height: '3px', flex: 1, backgroundColor: 'var(--color-success)' }}></div>
            <div style={{ height: '3px', flex: 1, backgroundColor: 'var(--color-success)' }}></div>
            <div style={{ height: '3px', flex: 1, backgroundColor: 'var(--color-success)' }}></div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-card-header">
            <span className="metric-card-title">Liquidity Ratio</span>
            <div style={{ backgroundColor: '#fef3c7', padding: '0.375rem', borderRadius: '50%' }}>
              <Activity size={16} color="var(--color-warning)" />
            </div>
          </div>
          <div className="metric-value">1.84x</div>
          <div className="metric-change down" style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>
            <AlertTriangle size={12} />
            <span>Approaching Alert Threshold</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Heatmap and Collateral Mix */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        {/* Heatmap Card */}
        <div className="card" style={{ margin: 0 }}>
          <div className="card-header">
            <div>
              <h3 className="card-title">Risk Concentration Heatmap</h3>
              <span className="card-subtitle">Loan concentration by borrower grade vs collateral types</span>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem', border: '1px solid var(--border-color-dark)', padding: '2px', borderRadius: '6px' }}>
              <button
                onClick={() => setHeatmapToggle('collateral')}
                className={`btn btn-small ${heatmapToggle === 'collateral' ? 'btn-primary' : 'btn-outline'}`}
                style={{ border: 'none', padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}
              >
                By Collateral
              </button>
              <button
                onClick={() => setHeatmapToggle('region')}
                className={`btn btn-small ${heatmapToggle === 'region' ? 'btn-primary' : 'btn-outline'}`}
                style={{ border: 'none', padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}
              >
                By Region
              </button>
            </div>
          </div>

          {/* Grid Box */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            marginTop: '1.5rem',
            backgroundColor: '#ffffff'
          }}>
            {activeHeatmap.map((row, rowIdx) => (
              <div key={rowIdx} style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '6px'
              }}>
                {row.map((cell, cellIdx) => (
                  <div
                    key={cellIdx}
                    style={{
                      height: '56px',
                      backgroundColor: cell.color,
                      color: cell.text || '#000000',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      fontSize: '0.8rem',
                      gridColumn: cell.isSpan ? 'span 2' : 'span 1',
                      border: '1px solid ' + (cell.color === '#f8fafc' ? '#f1f5f9' : 'transparent')
                    }}
                  >
                    {cell.val}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <span>Low Risk (AAA)</span>
            <div style={{
              height: '6px',
              flex: 1,
              margin: '0 1rem',
              borderRadius: '3px',
              background: 'linear-gradient(to right, #10b981 0%, #f59e0b 50%, #ef4444 100%)'
            }}></div>
            <span>High Risk (C)</span>
          </div>
        </div>

        {/* Collateral Mix Card */}
        <div className="card" style={{ margin: 0 }}>
          <div className="card-header">
            <div>
              <h3 className="card-title">Collateral Mix</h3>
              <span className="card-subtitle">Diversification across asset classes</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
            {[
              { name: 'Real Estate', percent: 45, color: 'var(--color-primary)' },
              { name: 'Tech Infrastructure', percent: 32, color: 'var(--color-success)' },
              { name: 'Vehicle Fleets', percent: 18, color: 'var(--color-warning)' },
              { name: 'Other', percent: 5, color: '#475569' }
            ].map((mix) => (
              <div key={mix.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.375rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: mix.color }}></span> {mix.name}
                  </span>
                  <span>{mix.percent}%</span>
                </div>
                <div className="progress-container" style={{ margin: 0, height: '8px' }}>
                  <div className="progress-bar" style={{ width: `${mix.percent}%`, backgroundColor: mix.color }}></div>
                </div>
              </div>
            ))}
          </div>

          <button className="btn btn-outline" style={{ width: '100%', marginTop: '1.5rem' }}>
            <FileText size={16} /> Generate Compliance Report
          </button>
        </div>
      </div>

      {/* Bottom Section: Stress Engine and Liquidity tracking */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.8fr 1fr',
        gap: '2rem'
      }}>
        {/* Stress simulation card */}
        <div className="card" style={{ margin: 0 }}>
          <div className="card-header">
            <div>
              <h3 className="card-title">Stress Simulation Engine</h3>
              <span className="card-subtitle">Model the impact of macroeconomic shifts on portfolio collateral</span>
            </div>
          </div>

          <form onSubmit={runSimulation} style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '2rem',
            marginTop: '1rem'
          }}>
            {/* Form Sliders */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  <span>Interest Rate Shift (+/- %)</span>
                  <span style={{ color: 'var(--color-primary)' }}>+{interestShift}%</span>
                </div>
                <input
                  type="range"
                  min="-5"
                  max="10"
                  step="0.5"
                  value={interestShift}
                  onChange={(e) => setInterestShift(parseFloat(e.target.value))}
                  style={{ width: '100%', cursor: 'pointer' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  <span>LTV Drop Rate (%)</span>
                  <span style={{ color: 'var(--color-primary)' }}>{ltvDrop}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="1"
                  value={ltvDrop}
                  onChange={(e) => setLtvDrop(parseInt(e.target.value))}
                  style={{ width: '100%', cursor: 'pointer' }}
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={isSimulating} style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                <Play size={14} /> {isSimulating ? 'Running Model...' : 'Run Simulation Model'}
              </button>
            </div>

            {/* Results box */}
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid var(--border-color-dark)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              minHeight: '160px'
            }}>
              {isSimulating && (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    border: '3px solid #eff6ff',
                    borderTop: '3px solid var(--color-primary)',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 0.75rem'
                  }}></div>
                  <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>Recalculating exposure risks...</span>
                </div>
              )}

              {simResults && !isSimulating && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--color-success)', fontWeight: '700', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                    <CheckCircle size={16} /> SIMULATION COMPLETE
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Risk Exposure Drift</div>
                  <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--color-danger)' }}>{simResults.exposureRiskHit}</div>
                  
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Reserve Impact</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)' }}>{simResults.liquidityDrain}</div>

                  <div style={{
                    marginTop: '0.75rem',
                    fontSize: '0.7rem',
                    padding: '0.25rem 0.5rem',
                    backgroundColor: simResults.action.includes('ALERT') ? 'var(--color-danger-bg)' : 'var(--color-success-bg)',
                    color: simResults.action.includes('ALERT') ? 'var(--color-danger-text)' : 'var(--color-success-text)',
                    borderRadius: '4px',
                    fontWeight: '600'
                  }}>
                    {simResults.action}
                  </div>
                </div>
              )}

              {!simResults && !isSimulating && (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Activity size={24} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
                  <span style={{ fontSize: '0.75rem' }}>Adjust sliders on the left and click run to model macroeconomic stress tests.</span>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Liquidity Tracking Card */}
        <div className="card" style={{ margin: 0, display: 'flex', flexDirection: 'column' }}>
          <div className="card-header" style={{ paddingBottom: '0.5rem' }}>
            <h3 className="card-title">Liquidity Tracking</h3>
            <span className="badge success" style={{ fontSize: '0.65rem', animation: 'pulse 2s infinite' }}>LIVE</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Collateral Pool</span>
              <strong style={{ color: 'var(--text-primary)' }}>$340,500,000 MVP</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Reserve Buffer</span>
              <strong style={{ color: 'var(--color-success)' }}>18.4% (Min 15%)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Sync Ledger</span>
              <strong style={{ color: 'var(--color-success)' }}>OK</strong>
            </div>

            {/* Sparkline Visual Simulation */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              height: '40px',
              gap: '3px',
              marginTop: 'auto',
              backgroundColor: '#fafcfd',
              padding: '4px',
              borderRadius: '4px',
              border: '1px solid #f1f5f9'
            }}>
              {[20, 30, 25, 45, 60, 50, 40, 55, 65, 80, 70, 75, 90, 85, 95].map((val, idx) => (
                <div
                  key={idx}
                  style={{
                    flex: 1,
                    backgroundColor: idx === 14 ? 'var(--color-danger)' : 'var(--color-primary)',
                    height: `${val}%`,
                    borderRadius: '1px'
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
