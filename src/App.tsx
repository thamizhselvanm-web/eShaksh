import React, { useState } from 'react';
import { Header } from './components/Header';
import { OverviewDashboard } from './components/OverviewDashboard';
import { AgencyProfile } from './components/AgencyProfile';
import { AnomalyDetail } from './components/AnomalyDetail';
import { IngestionModal } from './components/IngestionModal';
import { FieldAttestationModal } from './components/FieldAttestationModal';
import { SplashCursor } from './components/SplashCursor';
import { INITIAL_METRICS, MOCK_EVIDENCE_ITEMS, MOCK_AGENCIES } from './data/mockData';
import { EvidenceObject, AgencyProfileData, OverviewMetrics, FieldAttestationRecord } from './types/mplads';

export const App: React.FC = () => {
  const [metrics, setMetrics] = useState<OverviewMetrics>(INITIAL_METRICS);
  const [evidenceItems, setEvidenceItems] = useState<EvidenceObject[]>(MOCK_EVIDENCE_ITEMS);
  const [selectedConstituency, setSelectedConstituency] = useState<string>('Jaipur Parliamentary Constituency (#14)');

  // Navigation View State
  const [currentView, setCurrentView] = useState<'overview' | 'agency' | 'anomaly'>('overview');
  const [selectedAnomaly, setSelectedAnomaly] = useState<EvidenceObject | null>(null);
  const [selectedAgency, setSelectedAgency] = useState<AgencyProfileData | null>(null);

  // Modal States
  const [isIngestionOpen, setIsIngestionOpen] = useState<boolean>(false);
  const [isAttestationModalOpen, setIsAttestationModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSelectAnomaly = (item: EvidenceObject) => {
    setSelectedAnomaly(item);
    setCurrentView('anomaly');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectAgency = (agencyId: string) => {
    const agency = MOCK_AGENCIES.find(a => a.agencyId === agencyId) || MOCK_AGENCIES[0];
    setSelectedAgency(agency);
    setCurrentView('agency');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    setCurrentView('overview');
    setSelectedAnomaly(null);
    setSelectedAgency(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleIngestionSuccess = () => {
    showToast("Dataset successfully normalized! Vendor graph & ground-truth scores re-calculated.");
  };

  const handleCommitAttestation = (workId: string, attestation: FieldAttestationRecord) => {
    const updatedItems = evidenceItems.map((item) => {
      if (item.workId === workId) {
        return {
          ...item,
          groundTruth: {
            ...item.groundTruth,
            fieldAttestation: attestation
          }
        };
      }
      return item;
    });

    setEvidenceItems(updatedItems);

    if (selectedAnomaly && selectedAnomaly.workId === workId) {
      setSelectedAnomaly({
        ...selectedAnomaly,
        groundTruth: {
          ...selectedAnomaly.groundTruth,
          fieldAttestation: attestation
        }
      });
    }

    showToast(`C2PA Verified Media & Hashes Committed to DB for ${workId}! Record ID: ${attestation.dbRecordId}`);
  };

  const agencyWorks = selectedAgency
    ? evidenceItems.filter(i => i.agencyId === selectedAgency.agencyId)
    : [];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SplashCursor />

      {/* Top App Header */}
      <Header
        metrics={metrics}
        selectedConstituency={selectedConstituency}
        onSelectConstituency={(val) => {
          setSelectedConstituency(val);
          showToast(`Switched constituency focus to ${val}`);
        }}
        onOpenIngestion={() => setIsIngestionOpen(true)}
        onOpenAttestationModal={() => setIsAttestationModalOpen(true)}
        activeView={currentView}
        onNavigateHome={handleNavigateHome}
      />

      {/* Main Content Area */}
      <main className="app-container" style={{ flex: 1 }}>
        {currentView === 'overview' && (
          <OverviewDashboard
            metrics={metrics}
            evidenceItems={evidenceItems}
            onSelectAnomaly={handleSelectAnomaly}
            onSelectAgency={handleSelectAgency}
            onDatasetParsed={({ evidenceItems: newItems, metrics: newMetrics }) => {
              setEvidenceItems(newItems);
              setMetrics(newMetrics);
              showToast(`Live Dataset Analyzed: ${newItems.length} records processed across 3 core signals.`);
            }}
          />
        )}

        {currentView === 'agency' && selectedAgency && (
          <AgencyProfile
            agency={selectedAgency}
            agencyWorks={agencyWorks}
            onBack={handleNavigateHome}
            onSelectAnomaly={handleSelectAnomaly}
          />
        )}

        {currentView === 'anomaly' && selectedAnomaly && (
          <AnomalyDetail
            evidence={selectedAnomaly}
            onBack={handleNavigateHome}
            onSelectAgency={handleSelectAgency}
            onOpenCaptureModal={() => setIsAttestationModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '20px 28px', marginTop: '40px', background: 'rgba(7, 10, 17, 0.9)' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', fontSize: '0.8rem', color: '#64748B' }}>
          <div>
            <strong>MPLADS Expenditure Intelligence & Anomaly Triage System v2.0</strong> — Built for SIH 2026 Triage Monitor
          </div>
          <div>
            Decision-Support System: Makes no legal fraud or criminal intent determinations.
          </div>
        </div>
      </footer>

      {/* Ingestion Modal */}
      <IngestionModal
        isOpen={isIngestionOpen}
        onClose={() => setIsIngestionOpen(false)}
        onSuccess={handleIngestionSuccess}
        onDatasetParsed={({ evidenceItems: newItems, metrics: newMetrics }) => {
          setEvidenceItems(newItems);
          setMetrics(newMetrics);
          showToast(`Dataset Parsed & Pipeline Executed: ${newItems.length} records processed across 3 core signals.`);
        }}
        onResetDataset={() => {
          setEvidenceItems(MOCK_EVIDENCE_ITEMS);
          setMetrics(INITIAL_METRICS);
          showToast("Restored pre-seeded SIH demo dataset (3 planted cases).");
        }}
      />

      {/* C2PA Field Attestation Media Capture & Database Encoder Modal */}
      <FieldAttestationModal
        isOpen={isAttestationModalOpen}
        onClose={() => setIsAttestationModalOpen(false)}
        evidenceItems={evidenceItems}
        selectedWorkId={selectedAnomaly?.workId}
        onCommitAttestation={handleCommitAttestation}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid #06B6D4',
          borderRadius: '10px',
          padding: '12px 20px',
          color: '#F8FAFC',
          fontSize: '0.85rem',
          fontWeight: 500,
          boxShadow: '0 8px 24px rgba(6, 182, 212, 0.25)',
          zIndex: 200
        }}>
          ✨ {toastMessage}
        </div>
      )}

    </div>
  );
};
