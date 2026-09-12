import React from 'react';
import { AgencyProfileData, EvidenceObject } from '../types/mplads';
import { Building, ArrowLeft, BarChart2, ShieldCheck, Activity, ChevronRight } from 'lucide-react';

interface AgencyProfileProps {
  agency: AgencyProfileData;
  agencyWorks: EvidenceObject[];
  onBack: () => void;
  onSelectAnomaly: (item: EvidenceObject) => void;
}

export const AgencyProfile: React.FC<AgencyProfileProps> = ({
  agency,
  agencyWorks,
  onBack,
  onSelectAnomaly
}) => {
  const expendedPct = ((agency.totalExpended / agency.totalAllocation) * 100).toFixed(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Navigation Top */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button className="btn btn-outline" onClick={onBack}>
          <ArrowLeft size={16} /> Back to Overview Feed
        </button>
        <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>/ Agency Profile</span>
      </div>

      {/* Agency Summary Master Card */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(6, 182, 212, 0.2))',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#3B82F6'
            }}>
              <Building size={28} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', color: '#F8FAFC', margin: 0 }}>{agency.name}</h2>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: 0 }}>
                Jurisdiction Region: <strong style={{ color: '#CBD5E1' }}>{agency.region}</strong> | Agency ID: <span className="mono">{agency.agencyId}</span>
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'block' }}>Total Sanctions</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>{agency.workCount} Works</span>
            </div>
            <div style={{ background: 'rgba(244, 63, 94, 0.1)', padding: '10px 16px', borderRadius: '8px', border: '1px solid rgba(244, 63, 94, 0.3)', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#F43F5E', display: 'block' }}>Flagged Works</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F43F5E' }}>{agency.flaggedWorkCount} Flagged</span>
            </div>
          </div>

        </div>

        {/* Allocation vs Expended Progress */}
        <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
            <span style={{ color: '#94A3B8' }}>Budget Utilization: ₹{(agency.totalExpended / 10000000).toFixed(2)} Cr spent of ₹{(agency.totalAllocation / 10000000).toFixed(2)} Cr allocated</span>
            <span className="mono" style={{ fontWeight: 700, color: '#06B6D4' }}>{expendedPct}% Utilized</span>
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${expendedPct}%`, background: 'linear-gradient(90deg, #3B82F6, #06B6D4)' }} />
          </div>
        </div>
      </div>

      {/* Metrics Row: Vendor Density & Velocity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* Vendor Density & GT Compliance */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <ShieldCheck size={18} color="#06B6D4" />
            Agency Integrity Indicators
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                <span style={{ color: '#94A3B8' }}>Vendor Concentration Index</span>
                <span className="mono" style={{ fontWeight: 600, color: agency.vendorDensityIndex > 0.7 ? '#F43F5E' : '#10B981' }}>
                  {(agency.vendorDensityIndex * 100).toFixed(0)}% Concentration
                </span>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${agency.vendorDensityIndex * 100}%`, background: agency.vendorDensityIndex > 0.7 ? '#F43F5E' : '#10B981' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                <span style={{ color: '#94A3B8' }}>Ground-Truth Photo Verification Rate</span>
                <span className="mono" style={{ fontWeight: 600, color: '#10B981' }}>
                  {agency.groundTruthComplianceRate}% Compliance
                </span>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${agency.groundTruthComplianceRate}%`, background: '#10B981' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Spending Velocity Timeline */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Activity size={18} color="#8B5CF6" />
            Monthly Disbursement Velocity
          </h3>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '110px', paddingTop: '10px' }}>
            {agency.spendingVelocityHistory.map(m => {
              const heightPct = Math.min(100, (m.amount / 30000000) * 100);
              const isSpike = m.amount > m.baseline * 1.8;

              return (
                <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{
                    width: '100%',
                    height: `${heightPct}%`,
                    background: isSpike ? 'linear-gradient(180deg, #F43F5E, #F59E0B)' : 'linear-gradient(180deg, #8B5CF6, #3B82F6)',
                    borderRadius: '4px 4px 0 0'
                  }} />
                  <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{m.month}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Agency Works List */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Sanctioned Works Executed by {agency.name}</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {agencyWorks.map(work => (
            <div
              key={work.workId}
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}
              onClick={() => onSelectAnomaly(work)}
            >
              <div>
                <h4 style={{ fontSize: '0.95rem', margin: '0 0 4px 0' }}>{work.workTitle}</h4>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                  Vendor: {work.vendorName} | Sanction: ₹{work.sanctionAmount.toLocaleString()}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className={`badge ${work.priorityBand === 'HIGH' ? 'badge-high' : work.priorityBand === 'MEDIUM' ? 'badge-medium' : 'badge-low'}`}>
                  Score {work.anomalyScore.toFixed(1)}
                </span>
                <ChevronRight size={18} color="#06B6D4" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
