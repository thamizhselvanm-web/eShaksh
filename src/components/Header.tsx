import React from 'react';
import { Shield, Upload, Database, Activity, Sparkles, Filter } from 'lucide-react';
import { OverviewMetrics } from '../types/mplads';

interface HeaderProps {
  metrics: OverviewMetrics;
  selectedConstituency: string;
  onSelectConstituency: (val: string) => void;
  onOpenIngestion: () => void;
  onOpenAttestationModal?: () => void;
  activeView: 'overview' | 'agency' | 'anomaly';
  onNavigateHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  metrics,
  selectedConstituency,
  onSelectConstituency,
  onOpenIngestion,
  onOpenAttestationModal,
  activeView,
  onNavigateHome
}) => {
  return (
    <header className="glass-panel" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, padding: '16px 28px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Left Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }} onClick={onNavigateHome}>
          <div style={{ 
            width: '44px', 
            height: '44px', 
            borderRadius: '12px', 
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(139, 92, 246, 0.3))',
            border: '1px solid rgba(6, 182, 212, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(6, 182, 212, 0.25)'
          }}>
            <Shield size={24} color="#06B6D4" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
                eShaksh <span style={{ color: '#06B6D4' }}>AI</span> <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 500 }}>v2.0</span>
              </h1>
              <span className="badge badge-cyan" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                <Sparkles size={10} /> 3-CORE SIGNALS
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#94A3B8', margin: 0 }}>
              MPLADS Expenditure Intelligence & Anomaly Triage System
            </p>
          </div>
        </div>

        {/* Middle Status & Constituency Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(15, 23, 42, 0.6)', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <Filter size={14} color="#94A3B8" />
            <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 500 }}>Constituency:</span>
            <select
              value={selectedConstituency}
              onChange={(e) => onSelectConstituency(e.target.value)}
              style={{
                background: 'transparent',
                color: '#F8FAFC',
                border: 'none',
                fontSize: '0.85rem',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="Jaipur Parliamentary Constituency (#14)" style={{ background: '#0F172A' }}>Jaipur Parliamentary (#14)</option>
              <option value="Ajmer Parliamentary Constituency (#18)" style={{ background: '#0F172A' }}>Ajmer Parliamentary (#18)</option>
              <option value="Lucknow Parliamentary Constituency (#05)" style={{ background: '#0F172A' }}>Lucknow Parliamentary (#05)</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.75rem', color: '#94A3B8' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block', boxShadow: '0 0 8px #10B981' }}></span>
              Qwen3 Local LLM Active
            </span>
            <span style={{ color: '#475569' }}>|</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Database size={12} color="#06B6D4" />
              Graph DB Connected
            </span>
          </div>

        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {onOpenAttestationModal && (
            <button className="btn btn-primary" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.9), rgba(6, 182, 212, 0.9))', borderColor: '#10B981' }} onClick={onOpenAttestationModal}>
              <Activity size={16} />
              Capture / Upload C2PA Media
            </button>
          )}

          <button className="btn btn-secondary" onClick={onOpenIngestion}>
            <Upload size={16} />
            Ingest Dataset (CSV)
          </button>
          
          {activeView !== 'overview' && (
            <button className="btn btn-outline" onClick={onNavigateHome}>
              Overview Feed
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
