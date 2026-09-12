import React, { useState, useRef } from 'react';
import { EvidenceObject, OverviewMetrics } from '../types/mplads';
import { ShieldAlert, Network, Camera, DollarSign, BarChart3, AlertTriangle, ArrowRight, Sparkles, Filter, Upload, Download, FileSpreadsheet, CheckCircle2, ShieldCheck } from 'lucide-react';
import { parseCSVToEvidence, SAMPLE_CSV_CONTENT } from '../utils/csvParser';

interface OverviewDashboardProps {
  metrics: OverviewMetrics;
  evidenceItems: EvidenceObject[];
  onSelectAnomaly: (item: EvidenceObject) => void;
  onSelectAgency: (agencyId: string) => void;
  onDatasetParsed?: (data: { evidenceItems: EvidenceObject[]; metrics: OverviewMetrics }) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  metrics,
  evidenceItems,
  onSelectAnomaly,
  onSelectAgency,
  onDatasetParsed
}) => {
  const [signalFilter, setSignalFilter] = useState<'ALL' | 'VENDOR_NETWORK' | 'GROUND_TRUTH' | 'COST_REALISM' | 'STATISTICAL' | 'FIELD_ATTESTATION'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const filteredItems = evidenceItems.filter(item => {
    let matchesSignal = true;
    if (signalFilter === 'FIELD_ATTESTATION') {
      matchesSignal = !!(item.groundTruth.fieldAttestation && item.groundTruth.fieldAttestation.attestationTrustScore < 80);
    } else if (signalFilter !== 'ALL') {
      matchesSignal = item.dominantSignal === signalFilter;
    }
    
    let matchesPriority = true;
    if (priorityFilter !== 'ALL') {
      matchesPriority = item.priorityBand === priorityFilter;
    }

    return matchesSignal && matchesPriority;
  });

  const plantedCases = evidenceItems.filter(i => i.isPlantedDemoCase);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const result = parseCSVToEvidence(text);
        if (onDatasetParsed) {
          onDatasetParsed({
            evidenceItems: result.evidenceItems,
            metrics: result.metrics
          });
        }
        setUploadSuccessMsg(`Successfully analyzed ${file.name}: ${result.evidenceItems.length} records processed live!`);
        setTimeout(() => setUploadSuccessMsg(null), 4000);
      } catch (err: any) {
        alert(`CSV Processing Error: ${err.message || 'Invalid format'}`);
      } finally {
        setIsUploading(false);
      }
    };

    reader.readAsText(file);
  };

  const downloadSampleCSV = () => {
    const blob = new Blob([SAMPLE_CSV_CONTENT], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sample_mplads_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Live Upload & Interactive File Dropzone Banner */}
      <div className="glass-panel" style={{
        padding: '20px',
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12), rgba(59, 130, 246, 0.12))',
        borderColor: 'rgba(6, 182, 212, 0.4)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(6, 182, 212, 0.2)',
              border: '1px solid rgba(6, 182, 212, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#06B6D4'
            }}>
              <FileSpreadsheet size={26} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: '#F8FAFC', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                Live Dataset Analysis Engine
                <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>LIVE PARSER</span>
              </h3>
              <p style={{ fontSize: '0.825rem', color: '#CBD5E1', margin: 0 }}>
                Upload any <code className="mono" style={{ color: '#06B6D4' }}>.csv</code> or <code className="mono" style={{ color: '#06B6D4' }}>.xlsx</code> file to compute live 8-signal scores & triage ranked results instantly.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv,.xlsx,.txt"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />

            <button
              className="btn btn-primary"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Upload size={16} />
              {isUploading ? 'Analyzing Live CSV...' : 'Upload CSV / XLSX File'}
            </button>

            <button
              className="btn btn-secondary"
              onClick={downloadSampleCSV}
              style={{ fontSize: '0.8rem' }}
            >
              <Download size={14} /> Download Sample Dataset (.csv)
            </button>
          </div>

        </div>

        {uploadSuccessMsg && (
          <div style={{
            marginTop: '12px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            borderRadius: '6px',
            padding: '8px 12px',
            fontSize: '0.8rem',
            color: '#10B981',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle2 size={16} /> {uploadSuccessMsg}
          </div>
        )}
      </div>

      {/* Top Key Metric Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        
        {/* Metric 1: Total Expenditure */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.8rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total Monitored Expenditure
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '8px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }} className="mono">
              ₹{(metrics.totalExpenditure / 10000000).toFixed(2)} Cr
            </h2>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px', display: 'block' }}>
            Across {metrics.totalWorks} constituency sanction works
          </span>
        </div>

        {/* Metric 2: High Risk Anomalies */}
        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #F43F5E' }}>
          <span style={{ fontSize: '0.8rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            High-Priority Triage Cases
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '8px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#F43F5E' }}>
              {metrics.highPriorityCount} Works
            </h2>
            <span className="badge badge-high" style={{ fontSize: '0.65rem' }}>Score ≥ 80</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px', display: 'block' }}>
            Ranked for immediate audit verification
          </span>
        </div>

        {/* Metric 3: Shell Vendors Detected */}
        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #06B6D4' }}>
          <span style={{ fontSize: '0.8rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Shell Vendor Networks
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '8px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#06B6D4' }}>
              {metrics.shellVendorsDetected} Entity Clusters
            </h2>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px', display: 'block' }}>
            Cross-agency bank account prefix sharing
          </span>
        </div>

        {/* Metric 4: Ground-Truth Mismatch Rate */}
        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #F59E0B' }}>
          <span style={{ fontSize: '0.8rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Ground-Truth Mismatch Rate
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '8px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#F59E0B' }}>
              {metrics.groundTruthMismatchRate}%
            </h2>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px', display: 'block' }}>
            Geotag / photo evidence discrepancies
          </span>
        </div>

      </div>

      {/* SIH Presentation Demo Cases Banner */}
      {plantedCases.length > 0 && (
        <div className="glass-panel" style={{
          padding: '16px 20px',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12), rgba(139, 92, 246, 0.12))',
          borderColor: 'rgba(6, 182, 212, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Sparkles size={24} color="#06B6D4" />
            <div>
              <h4 style={{ fontSize: '0.95rem', color: '#F8FAFC', margin: 0 }}>
                Judged Demo Focus: 3 Catches Pure-Statistical Tools Miss
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#CBD5E1', margin: 0 }}>
                Select any pre-seeded demo case to inspect how non-tabular signals (graph entity, photo geotag, SOR pricing) surface hidden anomalies.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {plantedCases.map(item => (
              <button
                key={item.workId}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '6px 12px', borderColor: 'rgba(6, 182, 212, 0.4)' }}
                onClick={() => onSelectAnomaly(item)}
              >
                {item.dominantSignal === 'VENDOR_NETWORK' ? '🕸️ Ghost Vendor' : item.dominantSignal === 'GROUND_TRUTH' ? '📍 Phantom Road' : '💰 CPWD Overprice'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filter Controls Bar */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Dominant Signal Filter Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', color: '#94A3B8', marginRight: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Filter size={14} /> Filter Signal:
          </span>

          <button className={`nav-tab ${signalFilter === 'ALL' ? 'active' : ''}`} onClick={() => setSignalFilter('ALL')}>
            All Signals
          </button>
          
          <button className={`nav-tab ${signalFilter === 'VENDOR_NETWORK' ? 'active' : ''}`} onClick={() => setSignalFilter('VENDOR_NETWORK')}>
            <Network size={14} color="#06B6D4" /> Vendor Graph
          </button>

          <button className={`nav-tab ${signalFilter === 'GROUND_TRUTH' ? 'active' : ''}`} onClick={() => setSignalFilter('GROUND_TRUTH')}>
            <Camera size={14} color="#F43F5E" /> Ground-Truth Photo
          </button>

          <button className={`nav-tab ${signalFilter === 'COST_REALISM' ? 'active' : ''}`} onClick={() => setSignalFilter('COST_REALISM')}>
            <DollarSign size={14} color="#F59E0B" /> Cost-Realism SOR
          </button>

          <button className={`nav-tab ${signalFilter === 'STATISTICAL' ? 'active' : ''}`} onClick={() => setSignalFilter('STATISTICAL')}>
            <BarChart3 size={14} color="#3B82F6" /> Statistical
          </button>

          <button className={`nav-tab ${signalFilter === 'FIELD_ATTESTATION' ? 'active' : ''}`} onClick={() => setSignalFilter('FIELD_ATTESTATION')}>
            <ShieldCheck size={14} color="#10B981" /> Field Attestation (C2PA)
          </button>
        </div>

        {/* Priority Filter Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Priority Band:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              padding: '6px 12px',
              color: '#F8FAFC',
              fontSize: '0.8rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="ALL" style={{ background: '#0F172A' }}>All Priority Bands</option>
            <option value="HIGH" style={{ background: '#0F172A' }}>High Priority (80–100)</option>
            <option value="MEDIUM" style={{ background: '#0F172A' }}>Medium Priority (60–79)</option>
            <option value="LOW" style={{ background: '#0F172A' }}>Low Priority (0–59)</option>
          </select>
        </div>

      </div>

      {/* Anomaly Priority Feed Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredItems.map(item => {
          const isHigh = item.priorityBand === 'HIGH';
          const isMed = item.priorityBand === 'MEDIUM';

          return (
            <div
              key={item.workId}
              className="glass-panel glass-card-interactive"
              style={{
                padding: '20px',
                cursor: 'pointer',
                borderLeft: `5px solid ${isHigh ? '#F43F5E' : isMed ? '#F59E0B' : '#10B981'}`
              }}
              onClick={() => onSelectAnomaly(item)}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                
                {/* Left Title & Info */}
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <span className={`badge ${isHigh ? 'badge-high' : isMed ? 'badge-medium' : 'badge-low'}`}>
                      Score {item.anomalyScore.toFixed(1)} / 100
                    </span>

                    {item.isPlantedDemoCase && (
                      <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
                        <Sparkles size={10} /> {item.demoCaseTitle}
                      </span>
                    )}

                    <span className="badge badge-violet" style={{ fontSize: '0.65rem' }}>
                      {item.dominantSignal.replace('_', ' ')}
                    </span>

                    {item.groundTruth.fieldAttestation && (
                      <span
                        className={`badge ${item.groundTruth.fieldAttestation.attestationTrustScore >= 80 ? 'badge-low' : 'badge-high'}`}
                        style={{ fontSize: '0.65rem' }}
                      >
                        <ShieldCheck size={10} /> C2PA: {item.groundTruth.fieldAttestation.attestationTrustScore}/100 ({item.groundTruth.fieldAttestation.signatureStatus})
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.1rem', color: '#F8FAFC', marginBottom: '6px' }}>
                    {item.workTitle}
                  </h3>

                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: '#94A3B8', flexWrap: 'wrap' }}>
                    <span>Executing Agency: <strong style={{ color: '#CBD5E1' }}>{item.agencyName}</strong></span>
                    <span>Beneficiary Vendor: <strong style={{ color: '#CBD5E1' }}>{item.vendorName}</strong></span>
                    <span>Sanction: <strong className="mono" style={{ color: '#06B6D4' }}>₹{item.sanctionAmount.toLocaleString()}</strong></span>
                  </div>
                </div>

                {/* Right Signal Summary Snippet */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ textAlign: 'right', minWidth: '160px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'block' }}>Primary Key Finding:</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: isHigh ? '#F43F5E' : '#F59E0B' }}>
                      {item.dominantSignal === 'VENDOR_NETWORK' && `${item.vendorGraphSummary.shellIndicatorsCount} Shell Vendors Shared`}
                      {item.dominantSignal === 'GROUND_TRUTH' && `${item.groundTruth.distanceDeltaKm.toFixed(1)} km Geotag Discrepancy`}
                      {item.dominantSignal === 'COST_REALISM' && `+${item.costRealism.deviationPct.toFixed(0)}% Over CPWD Rate`}
                      {item.dominantSignal === 'STATISTICAL' && `+${item.zScore.toFixed(2)}σ Z-Score Baseline`}
                    </span>
                  </div>

                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#06B6D4'
                  }}>
                    <ArrowRight size={20} />
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
