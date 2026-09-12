import React, { useState } from 'react';
import { EvidenceObject } from '../types/mplads';
import { VendorGraphView } from './evidence/VendorGraphView';
import { GroundTruthView } from './evidence/GroundTruthView';
import { FieldAttestationView } from './evidence/FieldAttestationView';
import { CostRealismView } from './evidence/CostRealismView';
import { StatisticalView } from './evidence/StatisticalView';
import { SourceRecordsView } from './evidence/SourceRecordsView';
import { AIExplanationPanel } from './AIExplanationPanel';
import { ArrowLeft, Network, Camera, DollarSign, BarChart3, Database, Sparkles, ShieldCheck } from 'lucide-react';

interface AnomalyDetailProps {
  evidence: EvidenceObject;
  onBack: () => void;
  onSelectAgency: (agencyId: string) => void;
  onOpenCaptureModal?: () => void;
}

export const AnomalyDetail: React.FC<AnomalyDetailProps> = ({
  evidence,
  onBack,
  onSelectAgency,
  onOpenCaptureModal
}) => {
  const [activeTab, setActiveTab] = useState<'vendor' | 'groundtruth' | 'attestation' | 'cost' | 'statistical' | 'source'>('attestation');
  const [showAIPanel, setShowAIPanel] = useState<boolean>(true);

  const isHigh = evidence.priorityBand === 'HIGH';
  const isMed = evidence.priorityBand === 'MEDIUM';

  const attestation = evidence.groundTruth.fieldAttestation;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="btn btn-outline" onClick={onBack}>
            <ArrowLeft size={16} /> Back to Overview Feed
          </button>
          <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
            / Triage Case <span className="mono" style={{ color: '#06B6D4' }}>{evidence.workId}</span>
          </span>
        </div>

        <button
          className={`btn ${showAIPanel ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setShowAIPanel(!showAIPanel)}
        >
          <Sparkles size={16} /> {showAIPanel ? 'Hide AI Briefing' : 'Show Qwen3 AI Briefing'}
        </button>
      </div>

      {/* Anomaly Master Header & 8-Signal Weighted Breakdown */}
      <div className="glass-panel" style={{ padding: '24px', borderLeft: `6px solid ${isHigh ? '#F43F5E' : isMed ? '#F59E0B' : '#10B981'}` }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          
          <div style={{ flex: 1, minWidth: '320px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span className={`badge ${isHigh ? 'badge-high' : isMed ? 'badge-medium' : 'badge-low'}`} style={{ fontSize: '0.8rem', padding: '4px 12px' }}>
                Priority Triage Score: {evidence.anomalyScore.toFixed(1)} / 100
              </span>

              <span className="badge badge-cyan" style={{ fontSize: '0.75rem' }}>
                Dominant: {evidence.dominantSignal.replace('_', ' ')}
              </span>

              {attestation && (
                <span className={`badge ${(attestation.attestationTrustScore ?? 0) >= 80 ? 'badge-low' : 'badge-high'}`} style={{ fontSize: '0.75rem' }}>
                  <ShieldCheck size={12} /> C2PA Hardware Trust: {attestation.attestationTrustScore}/100 ({attestation.signatureStatus})
                </span>
              )}

              {evidence.isPlantedDemoCase && (
                <span className="badge badge-violet" style={{ fontSize: '0.75rem' }}>
                  <Sparkles size={12} /> {evidence.demoCaseTitle}
                </span>
              )}
            </div>

            <h2 style={{ fontSize: '1.4rem', color: '#F8FAFC', margin: '0 0 8px 0' }}>
              {evidence.workTitle}
            </h2>

            <div style={{ display: 'flex', gap: '20px', fontSize: '0.85rem', color: '#94A3B8', flexWrap: 'wrap' }}>
              <span style={{ cursor: 'pointer' }} onClick={() => onSelectAgency(evidence.agencyId)}>
                Agency: <strong style={{ color: '#06B6D4', textDecoration: 'underline' }}>{evidence.agencyName}</strong>
              </span>
              <span>Vendor: <strong style={{ color: '#F8FAFC' }}>{evidence.vendorName}</strong></span>
              <span>Sanction Amount: <strong className="mono" style={{ color: '#10B981' }}>₹{evidence.sanctionAmount.toLocaleString()}</strong></span>
            </div>
          </div>

          {/* Composite 8-Signal Radar Bar Deconstruction */}
          <div style={{
            background: 'rgba(7, 10, 17, 0.7)',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            width: '320px'
          }}>
            <span style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              8-Signal Weight Decomposition:
            </span>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>
                <span style={{ color: '#06B6D4', fontWeight: 600 }}>Vendor Risk (20%):</span>
                <span className="mono">{evidence.signals.vendorRisk}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>
                <span style={{ color: '#F43F5E', fontWeight: 600 }}>Ground Truth (20%):</span>
                <span className="mono">{evidence.signals.groundTruthMismatch}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>
                <span style={{ color: '#F59E0B', fontWeight: 600 }}>Cost Realism (10%):</span>
                <span className="mono">{evidence.signals.costRealismDev}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>
                <span style={{ color: '#3B82F6' }}>Historical Dev (15%):</span>
                <span className="mono">{evidence.signals.historicalDev}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#8B5CF6' }}>Velocity (15%):</span>
                <span className="mono">{evidence.signals.velocity}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#CBD5E1' }}>Peer Dev (10%):</span>
                <span className="mono">{evidence.signals.peerDev}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Navigation Tabs for 6 Evidence Object Views */}
      <div className="glass-panel" style={{ padding: '4px 12px', display: 'flex', gap: '4px', overflowX: 'auto' }}>
        <button
          className={`nav-tab ${activeTab === 'attestation' ? 'active' : ''}`}
          onClick={() => setActiveTab('attestation')}
        >
          <ShieldCheck size={16} color={attestation?.attestationTrustScore && attestation.attestationTrustScore < 80 ? '#F43F5E' : '#10B981'} />
          Field Attestation (C2PA & Trace)
        </button>

        <button
          className={`nav-tab ${activeTab === 'vendor' ? 'active' : ''}`}
          onClick={() => setActiveTab('vendor')}
        >
          <Network size={16} color="#06B6D4" /> Vendor Graph View
        </button>

        <button
          className={`nav-tab ${activeTab === 'groundtruth' ? 'active' : ''}`}
          onClick={() => setActiveTab('groundtruth')}
        >
          <Camera size={16} color="#F43F5E" /> Ground-Truth Photo View
        </button>

        <button
          className={`nav-tab ${activeTab === 'cost' ? 'active' : ''}`}
          onClick={() => setActiveTab('cost')}
        >
          <DollarSign size={16} color="#F59E0B" /> Cost-Realism View (SOR)
        </button>

        <button
          className={`nav-tab ${activeTab === 'statistical' ? 'active' : ''}`}
          onClick={() => setActiveTab('statistical')}
        >
          <BarChart3 size={16} color="#3B82F6" /> Statistical Evidence View
        </button>

        <button
          className={`nav-tab ${activeTab === 'source' ? 'active' : ''}`}
          onClick={() => setActiveTab('source')}
        >
          <Database size={16} color="#8B5CF6" /> Raw Source Records
        </button>
      </div>

      {/* Main Grid: Evidence Panel + AI Assistant Sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: showAIPanel ? '1fr 380px' : '1fr', gap: '20px' }}>
        
        {/* Active Tab Panel Container */}
        <div>
          {activeTab === 'attestation' && (
            <FieldAttestationView
              attestation={evidence.groundTruth.fieldAttestation}
              workTitle={evidence.workTitle}
              onOpenCaptureModal={onOpenCaptureModal}
            />
          )}

          {activeTab === 'vendor' && (
            <VendorGraphView
              data={evidence.vendorGraphSummary}
              vendorName={evidence.vendorName}
              agencyName={evidence.agencyName}
            />
          )}

          {activeTab === 'groundtruth' && (
            <GroundTruthView
              data={evidence.groundTruth}
              workTitle={evidence.workTitle}
            />
          )}

          {activeTab === 'cost' && (
            <CostRealismView
              data={evidence.costRealism}
              sanctionAmount={evidence.sanctionAmount}
            />
          )}

          {activeTab === 'statistical' && (
            <StatisticalView
              signals={evidence.signals}
              baselineMean={evidence.historicalBaselineMean}
              zScore={evidence.zScore}
              iqrDispersion={evidence.iqrDispersion}
              velocityIndex={evidence.spendingVelocityIndex}
              sanctionAmount={evidence.sanctionAmount}
            />
          )}

          {activeTab === 'source' && (
            <SourceRecordsView
              records={evidence.sourceRecords}
              workTitle={evidence.workTitle}
            />
          )}
        </div>

        {/* AI Briefing Panel Sidebar */}
        {showAIPanel && (
          <div style={{ height: '100%' }}>
            <AIExplanationPanel evidence={evidence} />
          </div>
        )}

      </div>

    </div>
  );
};
