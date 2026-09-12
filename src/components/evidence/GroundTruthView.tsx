import React, { useState } from 'react';
import { GroundTruthRecord } from '../../types/mplads';
import { Camera, MapPin, Clock, AlertTriangle, CheckCircle2, HelpCircle, Sliders, ShieldCheck, Lock, Activity, CloudSun, UserCheck, Cpu } from 'lucide-react';

interface GroundTruthViewProps {
  data: GroundTruthRecord;
  workTitle: string;
}

export const GroundTruthView: React.FC<GroundTruthViewProps> = ({ data, workTitle }) => {
  const [activeSubTab, setActiveSubTab] = useState<'photo_geotag' | 'field_attestation'>('photo_geotag');
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setSliderPosition((x / rect.width) * 100);
  };

  const isUnverifiable = data.status === 'UNVERIFIABLE' || !data.photoAfterUrl;
  const attestation = data.fieldAttestation;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Sub-Tab Navigation Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(15, 23, 42, 0.7)',
        padding: '8px 12px',
        borderRadius: '10px',
        border: '1px solid var(--border-color)',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn ${activeSubTab === 'photo_geotag' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.8rem', padding: '6px 14px' }}
            onClick={() => setActiveSubTab('photo_geotag')}
          >
            <Camera size={14} /> Photo & Geotag Verification
          </button>
          
          <button
            className={`btn ${activeSubTab === 'field_attestation' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.8rem', padding: '6px 14px' }}
            onClick={() => setActiveSubTab('field_attestation')}
          >
            <ShieldCheck size={14} color={attestation?.signatureStatus === 'VALID' ? '#10B981' : '#F43F5E'} />
            C2PA Field Attestation & Hardware Trace
          </button>
        </div>

        {attestation && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.75rem' }}>
            <span style={{ color: '#94A3B8' }}>C2PA Manifest:</span>
            <span className={`badge ${attestation.signatureStatus === 'VALID' ? 'badge-low' : 'badge-high'}`}>
              {attestation.signatureStatus === 'VALID' ? 'CRYPTOGRAPHICALLY SIGNED' : 'MANIFEST INVALID / TAMPERED'}
            </span>
          </div>
        )}
      </div>

      {/* SUB-TAB 1: Photo & Geotag Verification */}
      {activeSubTab === 'photo_geotag' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
          
          {/* Photo Comparison & Image Slider */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Camera size={20} color="#06B6D4" />
                  eSAKSHI Geotagged Photo Evidence
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                  Multi-stage photo comparison slider & light CV structure presence check.
                </p>
              </div>

              {!isUnverifiable && (
                <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                  <Sliders size={12} /> Drag Slider to Compare
                </span>
              )}
            </div>

            {isUnverifiable ? (
              <div style={{
                height: '340px',
                background: 'rgba(15, 23, 42, 0.6)',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                textAlign: 'center'
              }}>
                <HelpCircle size={48} color="#94A3B8" style={{ marginBottom: '12px' }} />
                <h4 style={{ fontSize: '1.1rem', color: '#CBD5E1', marginBottom: '8px' }}>
                  Ground-Truth Verification: Unverifiable
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#64748B', maxWidth: '420px' }}>
                  {data.unverifiableReason || "No geotagged stage photo available on eSAKSHI portal. The system gracefully degrades score to neutral (unverifiable) rather than assigning false-positive risk."}
                </p>
              </div>
            ) : (
              <div
                className="image-compare-container"
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
                onMouseMove={handleMouseMove}
              >
                {/* Base Image (After / Claimed Completed Work) */}
                <img
                  src={data.photoAfterUrl}
                  alt="Claimed Completed Work"
                  className="image-compare-img"
                />
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(15, 23, 42, 0.85)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#06B6D4'
                }}>
                  Claimed Completion Photo
                </div>

                {/* Overlay Image (Before Work / Site Baseline) */}
                <div
                  className="image-compare-overlay"
                  style={{ width: `${sliderPosition}%` }}
                >
                  <img
                    src={data.photoBeforeUrl}
                    alt="Baseline / Before Work"
                    className="image-compare-img"
                    style={{ width: '100%', minWidth: '550px' }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(15, 23, 42, 0.85)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#F59E0B'
                  }}>
                    Baseline Site Photo
                  </div>
                </div>

                {/* Vertical Slider Handle */}
                <div
                  className="image-compare-slider"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="image-compare-handle">
                    <Sliders size={16} />
                  </div>
                </div>
              </div>
            )}

            {/* Vision Classifier & Timestamp Card Below Image */}
            {!isUnverifiable && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
                <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'block' }}>CV Structure Classifier:</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: data.status === 'MISMATCH' ? '#F43F5E' : '#10B981' }}>
                    {data.cvPresenceClass}
                  </span>
                </div>
                
                <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'block' }}>EXIF Capture Timestamp:</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }} className="mono">
                    {data.exifTimestamp}
                  </span>
                </div>
              </div>
            )}

          </div>

          {/* Geotag GPS & Ground-Truth Score Decomposition */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Ground Truth Score Header Card */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <span style={{ fontSize: '0.8rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Ground-Truth Confidence Index
              </span>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginTop: '8px', marginBottom: '12px' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: data.status === 'MISMATCH' ? '#F43F5E' : data.status === 'VERIFIED' ? '#10B981' : '#94A3B8' }}>
                  {data.confidenceScore !== null ? `${data.confidenceScore}%` : 'N/A'}
                </h2>
                <span className={`badge ${data.status === 'MISMATCH' ? 'badge-high' : data.status === 'VERIFIED' ? 'badge-low' : 'badge-cyan'}`}>
                  {data.status}
                </span>
              </div>

              {/* Progress bar */}
              <div className="progress-bar-track" style={{ marginBottom: '16px' }}>
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${data.confidenceScore ?? 50}%`,
                    background: data.status === 'MISMATCH' ? '#F43F5E' : data.status === 'VERIFIED' ? '#10B981' : '#94A3B8'
                  }}
                />
              </div>

              <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                {data.status === 'MISMATCH'
                  ? "Critical Mismatch: Geotag coordinates or photo timestamps do not align with registered work location."
                  : data.status === 'VERIFIED'
                  ? "High Ground-Truth Confidence: Geotagged evidence closely matches physical work parameters."
                  : "Unverifiable State: Degraded to neutral score without penalizing agency."}
              </p>
            </div>

            {/* GPS Geotag Distance Delta Card */}
            <div className="glass-panel" style={{ padding: '20px', flex: 1 }}>
              <h4 style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <MapPin size={18} color="#F59E0B" />
                Geotag Location Cross-Check
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: '#94A3B8' }}>Claimed Site GPS:</span>
                  <span className="mono" style={{ color: '#F8FAFC' }}>
                    {data.claimedLat.toFixed(4)} N, {data.claimedLng.toFixed(4)} E
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: '#94A3B8' }}>Photo EXIF GPS:</span>
                  <span className="mono" style={{ color: data.distanceDeltaKm > 1 ? '#F43F5E' : '#10B981' }}>
                    {data.geotagLat ? `${data.geotagLat.toFixed(4)} N, ${data.geotagLng.toFixed(4)} E` : 'No EXIF GPS Data'}
                  </span>
                </div>

                <div style={{
                  background: data.distanceDeltaKm > 1 ? 'rgba(244, 63, 94, 0.12)' : 'rgba(16, 185, 129, 0.1)',
                  border: data.distanceDeltaKm > 1 ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: '8px',
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'block' }}>Distance Discrepancy:</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: data.distanceDeltaKm > 1 ? '#F43F5E' : '#10B981' }}>
                      {data.distanceDeltaKm.toFixed(2)} km Delta
                    </span>
                  </div>
                  {data.distanceDeltaKm > 1 ? (
                    <AlertTriangle size={24} color="#F43F5E" />
                  ) : (
                    <CheckCircle2 size={24} color="#10B981" />
                  )}
                </div>

                {/* Interactive SVG Distance Diagram */}
                <div style={{
                  height: '110px',
                  background: 'rgba(7, 10, 17, 0.8)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="100%" height="100%" viewBox="0 0 300 80">
                    <line x1="60" y1="40" x2="240" y2="40" stroke={data.distanceDeltaKm > 1 ? '#F43F5E' : '#10B981'} strokeWidth="2" strokeDasharray="4 2" />
                    
                    {/* Registered Pin */}
                    <circle cx="60" cy="40" r="8" fill="#3B82F6" />
                    <text x="60" y="66" fill="#94A3B8" fontSize="10" textAnchor="middle">Claimed Site</text>
                    
                    {/* Photo Pin */}
                    <circle cx="240" cy="40" r="8" fill={data.distanceDeltaKm > 1 ? '#F43F5E' : '#10B981'} />
                    <text x="240" y="66" fill="#94A3B8" fontSize="10" textAnchor="middle">Photo Location</text>
                    
                    {/* Center Delta Label */}
                    <rect x="115" y="26" width="70" height="20" rx="4" fill="#0F172A" stroke="rgba(255,255,255,0.1)" />
                    <text x="150" y="40" fill={data.distanceDeltaKm > 1 ? '#F43F5E' : '#10B981'} fontSize="10" fontWeight="700" textAnchor="middle">
                      {data.distanceDeltaKm.toFixed(2)} km
                    </text>
                  </svg>
                </div>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* SUB-TAB 2: C2PA Field Attestation & Hardware Trace */}
      {activeSubTab === 'field_attestation' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
          
          {/* Left Column: C2PA Manifest & Continuous Trace Inspector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* C2PA Provenance Manifest Card */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                  <ShieldCheck size={20} color={attestation?.signatureStatus === 'VALID' ? '#10B981' : '#F43F5E'} />
                  C2PA Open Provenance Manifest (c2pa-rs)
                </h3>
                <span className={`badge ${attestation?.c2paSigned ? 'badge-low' : 'badge-high'}`}>
                  {attestation?.c2paSigned ? 'HARDWARE SIGNED' : 'UNAUTHENTICATED'}
                </span>
              </div>

              {attestation ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ background: 'rgba(7, 10, 17, 0.8)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.775rem' }}>
                    <div style={{ color: '#94A3B8', marginBottom: '2px' }}>C2PA Manifest URN:</div>
                    <div className="mono" style={{ color: '#06B6D4', wordBreak: 'break-all' }}>{attestation.c2paManifestId}</div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.725rem', color: '#94A3B8', display: 'block' }}>Hardware Key Store:</span>
                      <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                        <Cpu size={14} color="#3B82F6" />
                        {attestation.hardwareKeyStore}
                      </span>
                    </div>

                    <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.725rem', color: '#94A3B8', display: 'block' }}>Device Attestation:</span>
                      <span style={{ fontSize: '0.825rem', fontWeight: 600, color: attestation.deviceAttestation === 'PASSED' ? '#10B981' : '#F43F5E', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                        <Lock size={14} color={attestation.deviceAttestation === 'PASSED' ? '#10B981' : '#F43F5E'} />
                        {attestation.deviceAttestation} ({attestation.attestationAuthority})
                      </span>
                    </div>
                  </div>

                  {/* RFC 3161 Time-Stamping Authority */}
                  <div style={{
                    background: attestation.tsaValid ? 'rgba(16, 185, 129, 0.08)' : 'rgba(244, 63, 94, 0.08)',
                    border: attestation.tsaValid ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(244, 63, 94, 0.25)',
                    borderRadius: '8px',
                    padding: '12px',
                    fontSize: '0.8rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600, color: attestation.tsaValid ? '#10B981' : '#F43F5E', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={14} /> RFC 3161 Trusted Timestamp Authority (TSA)
                      </span>
                      <span className="mono" style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{attestation.tsaAuthority}</span>
                    </div>
                    <div className="mono" style={{ color: '#CBD5E1', fontSize: '0.775rem' }}>
                      Server Signed Timestamp: {attestation.tsaTimestamp}
                    </div>
                  </div>
                </div>
              ) : (
                <p style={{ fontSize: '0.8rem', color: '#64748B' }}>No hardware C2PA manifest recorded for this work.</p>
              )}
            </div>

            {/* Continuous GPS Hash-Chain Trace Inspector */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <h4 style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                  <Activity size={18} color="#06B6D4" />
                  Continuous GPS Hash-Chain Trace
                </h4>
                <span className={`badge ${attestation?.traceValid ? 'badge-low' : 'badge-high'}`}>
                  {attestation?.hashChainStatus}
                </span>
              </div>

              {attestation ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                    <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.7rem', color: '#94A3B8', display: 'block' }}>Sampled Points</span>
                      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#F8FAFC' }} className="mono">
                        {attestation.sampledPointsCount} GPS Waypoints
                      </span>
                    </div>

                    <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.7rem', color: '#94A3B8', display: 'block' }}>Visit Duration</span>
                      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#F8FAFC' }} className="mono">
                        {attestation.visitDurationMinutes} mins
                      </span>
                    </div>

                    <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.7rem', color: '#94A3B8', display: 'block' }}>Teleportation Jump</span>
                      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: attestation.teleportationJumpDetected ? '#F43F5E' : '#10B981' }}>
                        {attestation.teleportationJumpDetected ? 'DETECTED' : 'NONE'}
                      </span>
                    </div>
                  </div>

                  {/* SVG Hash-Chain Visualizer */}
                  <div style={{
                    background: 'rgba(7, 10, 17, 0.8)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <span style={{ fontSize: '0.725rem', color: '#94A3B8' }}>SHA-256 Hash Chain Head (point_n = SHA256(point_n + hash_prev)):</span>
                    <div className="mono" style={{ fontSize: '0.75rem', color: attestation.traceValid ? '#10B981' : '#F43F5E', wordBreak: 'break-all' }}>
                      {attestation.traceHashHead}
                    </div>

                    <svg width="100%" height="45" viewBox="0 0 320 40">
                      <line x1="20" y1="20" x2="300" y2="20" stroke={attestation.traceValid ? '#10B981' : '#F43F5E'} strokeWidth="2" strokeDasharray={attestation.traceValid ? 'none' : '4 2'} />
                      {[20, 60, 100, 140, 180, 220, 260, 300].map((cx, idx) => (
                        <g key={idx}>
                          <circle cx={cx} cy="20" r="5" fill={!attestation.traceValid && idx > 4 ? '#F43F5E' : '#06B6D4'} />
                          <text x={cx} y="36" fill="#64748B" fontSize="8" textAnchor="middle">t{idx * 2}m</text>
                        </g>
                      ))}
                    </svg>
                  </div>
                </div>
              ) : null}
            </div>

          </div>

          {/* Right Column: Field Attestation Trust Index & Random Assignment */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Attestation Trust Score Card */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <span style={{ fontSize: '0.8rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Hardware Field Attestation Score
              </span>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginTop: '8px', marginBottom: '12px' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: (attestation?.attestationTrustScore ?? 0) >= 80 ? '#10B981' : '#F43F5E' }}>
                  {attestation?.attestationTrustScore ?? 0}/100
                </h2>
                <span className={`badge ${(attestation?.attestationTrustScore ?? 0) >= 80 ? 'badge-low' : 'badge-high'}`}>
                  {(attestation?.attestationTrustScore ?? 0) >= 80 ? 'HIGH TRUST' : 'TAMPERING DETECTED'}
                </span>
              </div>

              {/* Trust Flags Pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                {attestation?.trustFlags.map((flag, fIdx) => (
                  <span
                    key={fIdx}
                    style={{
                      fontSize: '0.675rem',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: flag.includes('FAILED') || flag.includes('INVALID') || flag.includes('MISMATCH') || flag.includes('JUMP')
                        ? 'rgba(244, 63, 94, 0.15)'
                        : 'rgba(16, 185, 129, 0.15)',
                      color: flag.includes('FAILED') || flag.includes('INVALID') || flag.includes('MISMATCH') || flag.includes('JUMP')
                        ? '#F43F5E'
                        : '#10B981',
                      border: flag.includes('FAILED') || flag.includes('INVALID') || flag.includes('MISMATCH') || flag.includes('JUMP')
                        ? '1px solid rgba(244, 63, 94, 0.3)'
                        : '1px solid rgba(16, 185, 129, 0.3)',
                      fontWeight: 600
                    }}
                  >
                    {flag}
                  </span>
                ))}
              </div>
            </div>

            {/* Random Assignment Module */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <h4 style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <UserCheck size={18} color="#3B82F6" />
                Random Assignment Module
              </h4>

              {attestation ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94A3B8' }}>Assigned Inspector:</span>
                    <span style={{ fontWeight: 600, color: '#F8FAFC' }}>{attestation.inspectorName} ({attestation.inspectorId})</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94A3B8' }}>Random Push Time:</span>
                    <span className="mono" style={{ color: '#F8FAFC' }}>{attestation.assignmentPushedAt}</span>
                  </div>

                  <div style={{
                    background: attestation.isSuspiciouslyFast ? 'rgba(244, 63, 94, 0.12)' : 'rgba(15, 23, 42, 0.6)',
                    border: attestation.isSuspiciouslyFast ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <span style={{ fontSize: '0.725rem', color: '#94A3B8', display: 'block' }}>Assignment-to-Capture Gap:</span>
                      <span style={{ fontWeight: 700, color: attestation.isSuspiciouslyFast ? '#F43F5E' : '#10B981' }}>
                        {attestation.assignmentGapMinutes} mins {attestation.isSuspiciouslyFast && '(Pre-staged Risk)'}
                      </span>
                    </div>
                    {attestation.isSuspiciouslyFast && <AlertTriangle size={20} color="#F43F5E" />}
                  </div>
                </div>
              ) : null}
            </div>

            {/* Environmental & Weather Cross-Check */}
            <div className="glass-panel" style={{ padding: '20px', flex: 1 }}>
              <h4 style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <CloudSun size={18} color="#F59E0B" />
                Weather & Environmental Log
              </h4>

              {attestation ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94A3B8' }}>Claimed Photo Weather:</span>
                    <span style={{ color: '#F8FAFC' }}>{attestation.claimedWeather}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94A3B8' }}>OpenWeather API Log:</span>
                    <span style={{ color: attestation.weatherMatch ? '#10B981' : '#F43F5E', fontWeight: 600 }}>
                      {attestation.historicalApiWeather}
                    </span>
                  </div>

                  <div style={{
                    background: attestation.weatherMatch ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.12)',
                    border: attestation.weatherMatch ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(244, 63, 94, 0.3)',
                    borderRadius: '8px',
                    padding: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{ fontSize: '0.775rem', fontWeight: 600, color: attestation.weatherMatch ? '#10B981' : '#F43F5E' }}>
                      {attestation.weatherMatch ? 'Environmental Alignment Verified' : 'Weather Mismatch: Photo Sunny vs Logged Rain'}
                    </span>
                    {attestation.weatherMatch ? <CheckCircle2 size={18} color="#10B981" /> : <AlertTriangle size={18} color="#F43F5E" />}
                  </div>
                </div>
              ) : null}
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
