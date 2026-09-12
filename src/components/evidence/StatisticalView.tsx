import React from 'react';
import { SignalBreakdown } from '../../types/mplads';
import { BarChart3, Activity, Zap, TrendingUp } from 'lucide-react';

interface StatisticalViewProps {
  signals: SignalBreakdown;
  baselineMean: number;
  zScore: number;
  iqrDispersion: number;
  velocityIndex: number;
  sanctionAmount: number;
}

export const StatisticalView: React.FC<StatisticalViewProps> = ({
  signals,
  baselineMean,
  zScore,
  iqrDispersion,
  velocityIndex,
  sanctionAmount
}) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      
      {/* Baseline Statistical Deviation Card */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <BarChart3 size={20} color="#3B82F6" />
          Agency Behavioral Baseline & Z-Score
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'block' }}>Historical Baseline Mean:</span>
            <span className="mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F8FAFC' }}>
              ₹{baselineMean.toLocaleString()}
            </span>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'block' }}>Rolling Z-Score Deviation:</span>
            <span className="mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: zScore > 2 ? '#F43F5E' : '#3B82F6' }}>
              +{zScore.toFixed(2)} σ
            </span>
          </div>
        </div>

        {/* Statistical Signal Progress Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
              <span style={{ color: '#CBD5E1' }}>Historical Expenditure Deviation (15%)</span>
              <span className="mono" style={{ fontWeight: 600 }}>{signals.historicalDev}/100</span>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${signals.historicalDev}%`, background: '#3B82F6' }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
              <span style={{ color: '#CBD5E1' }}>Spending Velocity Spike (15%)</span>
              <span className="mono" style={{ fontWeight: 600 }}>{signals.velocity}/100</span>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${signals.velocity}%`, background: '#8B5CF6' }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
              <span style={{ color: '#CBD5E1' }}>Peer Group Deviation (10%)</span>
              <span className="mono" style={{ fontWeight: 600 }}>{signals.peerDev}/100</span>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${signals.peerDev}%`, background: '#06B6D4' }} />
            </div>
          </div>
        </div>

      </div>

      {/* Dispersion & Velocity Metrics Card */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Activity size={20} color="#8B5CF6" />
          IQR Dispersion & Transaction Velocity
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ background: 'rgba(139, 92, 246, 0.08)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#C084FC', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Zap size={16} /> Velocity Index
              </span>
              <span className="mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F8FAFC' }}>
                {velocityIndex.toFixed(2)}x Baseline Speed
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#CBD5E1' }}>
              Measures fund disbursement speed immediately prior to quarter-end reporting or sanction deadlines.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'block' }}>Interquartile Range (IQR):</span>
              <span className="mono" style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                ₹{iqrDispersion.toLocaleString()}
              </span>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'block' }}>Sanction Amount:</span>
              <span className="mono" style={{ fontSize: '0.95rem', fontWeight: 600, color: '#06B6D4' }}>
                ₹{sanctionAmount.toLocaleString()}
              </span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
