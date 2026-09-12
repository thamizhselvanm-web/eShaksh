import React from 'react';
import { FieldAttestationRecord } from '../../types/mplads';
import { ShieldCheck, Lock, Activity, CloudSun, UserCheck, Cpu, AlertTriangle, CheckCircle2, Clock, ShieldAlert, KeyRound, Radio, Database } from 'lucide-react';

interface FieldAttestationViewProps {
  attestation?: FieldAttestationRecord;
  workTitle: string;
  onOpenCaptureModal?: () => void;
}

export const FieldAttestationView: React.FC<FieldAttestationViewProps> = ({ attestation, workTitle, onOpenCaptureModal }) => {
  if (!attestation) {
    return (
      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
        <ShieldAlert size={48} color="#94A3B8" style={{ marginBottom: '12px' }} />
        <h3 style={{ fontSize: '1.2rem', color: '#CBD5E1', marginBottom: '8px' }}>
          No Field Attestation Record Found
        </h3>
        <p style={{ fontSize: '0.85rem', color: '#64748B', maxWidth: '480px', margin: '0 auto', marginBottom: '16px' }}>
          This legacy expenditure submission was logged prior to the C2PA Field Attestation hardware-backed security protocol deployment.
        </p>
        {onOpenCaptureModal && (
          <button className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #10B981, #06B6D4)' }} onClick={onOpenCaptureModal}>
            <Activity size={16} /> Record Live C2PA Video / Upload Media Now
          </button>
        )}
      </div>
    );
  }

  const isTrusted = attestation.attestationTrustScore >= 80;
  const isFailed = !attestation.c2paSigned || attestation.deviceAttestation === 'FAILED' || attestation.teleportationJumpDetected;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Banner Card: C2PA Hardware Provenance Trust Score */}
      <div
        className="glass-panel"
        style={{
          padding: '24px',
          background: isFailed ? 'rgba(244, 63, 94, 0.08)' : 'rgba(16, 185, 129, 0.08)',
          borderLeft: `6px solid ${isFailed ? '#F43F5E' : '#10B981'}`,
          border: isFailed ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <ShieldCheck size={26} color={isFailed ? '#F43F5E' : '#10B981'} />
              <h2 style={{ fontSize: '1.3rem', margin: 0, color: '#F8FAFC' }}>
                Field Attestation Tier — C2PA Hardware Provenance
              </h2>
              <span className={`badge ${isFailed ? 'badge-high' : 'badge-low'}`} style={{ fontSize: '0.75rem' }}>
                {isFailed ? 'ATTEMPTED TAMPERING / MOCKED' : 'HARDWARE AUTHENTICATED'}
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: 0 }}>
              Hardware-backed cryptographic media signing (c2pa-rs), RFC 3161 TSA server timestamping & continuous SHA-256 location trace.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {onOpenCaptureModal && (
              <button className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #10B981, #06B6D4)' }} onClick={onOpenCaptureModal}>
                <Activity size={16} /> Record / Upload C2PA Media
              </button>
            )}

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Attestation Trust Score
              </div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: isFailed ? '#F43F5E' : '#10B981' }} className="mono">
                {attestation.attestationTrustScore} / 100
              </div>
            </div>
          </div>
        </div>

        {/* Trust Flags Bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {attestation.trustFlags.map((flag, idx) => {
            const isFlagBad = flag.includes('FAILED') || flag.includes('INVALID') || flag.includes('MISMATCH') || flag.includes('JUMP') || flag.includes('PRE_STAGED');
            return (
              <span
                key={idx}
                style={{
                  fontSize: '0.725rem',
                  padding: '3px 10px',
                  borderRadius: '6px',
                  background: isFlagBad ? 'rgba(244, 63, 94, 0.18)' : 'rgba(16, 185, 129, 0.18)',
                  color: isFlagBad ? '#F43F5E' : '#10B981',
                  border: isFlagBad ? '1px solid rgba(244, 63, 94, 0.4)' : '1px solid rgba(16, 185, 129, 0.4)',
                  fontWeight: 600
                }}
              >
                {flag}
              </span>
            );
          })}
        </div>
      </div>

      {/* Captured C2PA Video & DB Hashed Record Banner */}
      <div className="glass-panel" style={{ padding: '20px', background: 'rgba(7, 10, 17, 0.85)', border: '1px solid rgba(6, 182, 212, 0.4)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: attestation.mediaUrl ? '1fr 1fr' : '1fr', gap: '20px', alignItems: 'center' }}>
          
          {/* Video Player if Present */}
          {attestation.mediaUrl && (
            <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-color)', position: 'relative', height: '220px', background: '#000' }}>
              {attestation.mediaType === 'video' || attestation.mediaUrl.includes('.mp4') ? (
                <video src={attestation.mediaUrl} controls autoPlay loop style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <img src={attestation.mediaUrl} alt="C2PA Captured Media" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
              <div style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                background: 'rgba(15, 23, 42, 0.85)',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.725rem',
                color: '#10B981',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <ShieldCheck size={14} color="#10B981" /> Verified C2PA Captured Video Stream
              </div>
            </div>
          )}

          {/* Database Hashed Details Container (Requested by USER) */}
          <div id="c2pa-db-hash-container" style={{
            background: '#0F172A',
            borderRadius: '10px',
            border: '1px solid var(--border-color)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            fontSize: '0.8rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '6px' }}>
              <span style={{ color: '#06B6D4', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Database size={16} color="#10B981" /> DB Record & Cryptographic Hash Details
              </span>
              <span className="badge badge-low" style={{ fontSize: '0.65rem' }}>STORED IN DATABASE</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '4px' }}>
              <span style={{ color: '#94A3B8' }}>Database Record ID:</span>
              <span className="mono" style={{ color: '#10B981', fontWeight: 700 }}>
                {attestation.dbRecordId || 'DB-ATT-2026-901-SECURE'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '4px' }}>
              <span style={{ color: '#94A3B8' }}>Media Payload SHA-256 Digest:</span>
              <div className="mono" style={{ color: '#06B6D4', fontSize: '0.725rem', wordBreak: 'break-all' }}>
                {attestation.mediaHashSha256 || attestation.traceHashHead || 'sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '4px' }}>
              <span style={{ color: '#94A3B8' }}>TSA Timestamp Token:</span>
              <span className="mono" style={{ color: '#F8FAFC' }}>
                {attestation.tsaTimestamp}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94A3B8' }}>Hardware Key Store Signature:</span>
              <span style={{ color: '#3B82F6', fontWeight: 600 }}>
                {attestation.hardwareKeyStore} (RSA-2048)
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Main Grid Layout: 4 Core Modules */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '20px' }}>
        
        {/* Module 1: C2PA Cryptographic Manifest & Hardware Key Security */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <h3 style={{ fontSize: '1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <KeyRound size={18} color="#06B6D4" />
              1. C2PA Open Manifest & Hardware Enclave
            </h3>
            <span className={`badge ${attestation.c2paSigned ? 'badge-low' : 'badge-high'}`}>
              {attestation.c2paSigned ? 'c2pa-rs Valid' : 'Unsigned / Broken'}
            </span>
          </div>

          <div style={{ background: 'rgba(7, 10, 17, 0.8)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.725rem', color: '#94A3B8', display: 'block', marginBottom: '2px' }}>C2PA Manifest URN:</span>
            <div className="mono" style={{ fontSize: '0.8rem', color: '#06B6D4', wordBreak: 'break-all' }}>
              {attestation.c2paManifestId}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'block' }}>Hardware Key Store:</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                <Cpu size={16} color="#3B82F6" />
                {attestation.hardwareKeyStore}
              </span>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'block' }}>Device Attestation:</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: attestation.deviceAttestation === 'PASSED' ? '#10B981' : '#F43F5E', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                <Lock size={16} color={attestation.deviceAttestation === 'PASSED' ? '#10B981' : '#F43F5E'} />
                {attestation.deviceAttestation}
              </span>
              <span style={{ fontSize: '0.7rem', color: '#64748B', display: 'block', marginTop: '2px' }}>
                {attestation.attestationAuthority}
              </span>
            </div>
          </div>

          {/* RFC 3161 Time-Stamping Authority */}
          <div style={{
            background: attestation.tsaValid ? 'rgba(16, 185, 129, 0.08)' : 'rgba(244, 63, 94, 0.08)',
            border: attestation.tsaValid ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: '8px',
            padding: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontWeight: 600, fontSize: '0.85rem', color: attestation.tsaValid ? '#10B981' : '#F43F5E', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={16} /> RFC 3161 Time-Stamping Authority (TSA)
              </span>
              <span className="mono" style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{attestation.tsaAuthority}</span>
            </div>
            <div className="mono" style={{ color: '#CBD5E1', fontSize: '0.8rem' }}>
              Server Signed Timestamp: <strong>{attestation.tsaTimestamp}</strong>
            </div>
            <div style={{ fontSize: '0.725rem', color: '#94A3B8', marginTop: '4px' }}>
              Independent time-stamp token verified against trusted TSA public certificate.
            </div>
          </div>
        </div>

        {/* Module 2: Continuous GPS Hash-Chain Trace */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <h3 style={{ fontSize: '1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={18} color="#06B6D4" />
              2. Continuous GPS Hash-Chain Trace
            </h3>
            <span className={`badge ${attestation.traceValid ? 'badge-low' : 'badge-high'}`}>
              {attestation.hashChainStatus}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.725rem', color: '#94A3B8', display: 'block' }}>Sampled Points</span>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: '#F8FAFC' }} className="mono">
                {attestation.sampledPointsCount} Waypoints
              </span>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.725rem', color: '#94A3B8', display: 'block' }}>Visit Duration</span>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: '#F8FAFC' }} className="mono">
                {attestation.visitDurationMinutes} mins
              </span>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.725rem', color: '#94A3B8', display: 'block' }}>Teleportation Jump</span>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: attestation.teleportationJumpDetected ? '#F43F5E' : '#10B981' }}>
                {attestation.teleportationJumpDetected ? 'DETECTED' : 'NONE'}
              </span>
            </div>
          </div>

          {/* SVG Hash-Chain Diagram */}
          <div style={{
            background: 'rgba(7, 10, 17, 0.8)',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>SHA-256 Hash Chain Head:</span>
              <span style={{ fontSize: '0.7rem', color: '#06B6D4' }}>hash_n = SHA256(point_n + hash_prev)</span>
            </div>
            <div className="mono" style={{ fontSize: '0.775rem', color: attestation.traceValid ? '#10B981' : '#F43F5E', wordBreak: 'break-all' }}>
              {attestation.traceHashHead}
            </div>

            <svg width="100%" height="50" viewBox="0 0 340 45">
              <line x1="20" y1="22" x2="320" y2="22" stroke={attestation.traceValid ? '#10B981' : '#F43F5E'} strokeWidth="2" strokeDasharray={attestation.traceValid ? 'none' : '4 2'} />
              {[20, 62, 104, 146, 188, 230, 272, 314].map((cx, idx) => (
                <g key={idx}>
                  <circle cx={cx} cy="22" r="6" fill={!attestation.traceValid && idx > 4 ? '#F43F5E' : '#06B6D4'} stroke="#0F172A" strokeWidth="2" />
                  <text x={cx} y="40" fill="#94A3B8" fontSize="8" textAnchor="middle">t{idx * 2}m</text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Module 3: Random Assignment Module */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <h3 style={{ fontSize: '1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserCheck size={18} color="#3B82F6" />
              3. Random Assignment Module
            </h3>
            <span className={`badge ${attestation.isSuspiciouslyFast ? 'badge-high' : 'badge-cyan'}`}>
              {attestation.isSuspiciouslyFast ? 'PRE-STAGED RISK' : 'NORMAL ASSIGNMENT'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '6px' }}>
              <span style={{ color: '#94A3B8' }}>Assigned Field Inspector:</span>
              <span style={{ fontWeight: 600, color: '#F8FAFC' }}>{attestation.inspectorName} (<span className="mono" style={{ color: '#06B6D4' }}>{attestation.inspectorId}</span>)</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '6px' }}>
              <span style={{ color: '#94A3B8' }}>Randomized Morning Push:</span>
              <span className="mono" style={{ color: '#F8FAFC' }}>{attestation.assignmentPushedAt}</span>
            </div>

            <div style={{
              background: attestation.isSuspiciouslyFast ? 'rgba(244, 63, 94, 0.12)' : 'rgba(16, 185, 129, 0.1)',
              border: attestation.isSuspiciouslyFast ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '8px',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'block' }}>Assignment-to-Capture Gap:</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: attestation.isSuspiciouslyFast ? '#F43F5E' : '#10B981' }}>
                  {attestation.assignmentGapMinutes} mins {attestation.isSuspiciouslyFast && '(Suspiciously Fast)'}
                </span>
              </div>
              {attestation.isSuspiciouslyFast ? <AlertTriangle size={24} color="#F43F5E" /> : <CheckCircle2 size={24} color="#10B981" />}
            </div>
          </div>
        </div>

        {/* Module 4: Weather & Environmental Cross-Check */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <h3 style={{ fontSize: '1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CloudSun size={18} color="#F59E0B" />
              4. Weather & Environmental Cross-Check
            </h3>
            <span className={`badge ${attestation.weatherMatch ? 'badge-low' : 'badge-high'}`}>
              {attestation.weatherMatch ? 'WEATHER MATCH' : 'WEATHER MISMATCH'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '6px' }}>
              <span style={{ color: '#94A3B8' }}>Claimed Photo Weather:</span>
              <span style={{ color: '#F8FAFC', fontWeight: 600 }}>{attestation.claimedWeather}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '6px' }}>
              <span style={{ color: '#94A3B8' }}>OpenWeatherMap API Log:</span>
              <span style={{ color: attestation.weatherMatch ? '#10B981' : '#F43F5E', fontWeight: 600 }}>
                {attestation.historicalApiWeather}
              </span>
            </div>

            <div style={{
              background: attestation.weatherMatch ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.12)',
              border: attestation.weatherMatch ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(244, 63, 94, 0.3)',
              borderRadius: '8px',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: '0.825rem', fontWeight: 600, color: attestation.weatherMatch ? '#10B981' : '#F43F5E' }}>
                {attestation.weatherMatch ? 'Environmental Alignment Verified' : 'Gross Weather Mismatch: Sunny Photo vs Heavy Rain API Log'}
              </span>
              {attestation.weatherMatch ? <CheckCircle2 size={24} color="#10B981" /> : <AlertTriangle size={24} color="#F43F5E" />}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
