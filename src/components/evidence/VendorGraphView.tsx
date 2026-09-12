import React, { useState } from 'react';
import { SubgraphData, VendorNode } from '../../types/mplads';
import { Network, AlertTriangle, CreditCard, Building, ShieldAlert, CheckCircle, Info } from 'lucide-react';

interface VendorGraphViewProps {
  data: SubgraphData;
  vendorName: string;
  agencyName: string;
}

export const VendorGraphView: React.FC<VendorGraphViewProps> = ({ data, vendorName, agencyName }) => {
  const [selectedNode, setSelectedNode] = useState<VendorNode | null>(data.nodes[4] || data.nodes[0]);

  // Base preset positions
  const baseNodePositions: Record<string, { x: number; y: number }> = {
    "AGY-DRDA-JPR": { x: 140, y: 90 },
    "AGY-PWD-DIV3": { x: 140, y: 190 },
    "AGY-ZILA-PAR": { x: 140, y: 290 },
    "AGY-MUNI-CORP": { x: 140, y: 390 },
    "VND-APEX-INFRA": { x: 420, y: 120 },
    "VND-SKYLINE": { x: 420, y: 240 },
    "VND-VERTEX": { x: 420, y: 360 },
    "VND-VANGUARD": { x: 420, y: 240 },
    "VND-SOLARIS": { x: 420, y: 240 },
    "VND-MARUDHAR": { x: 420, y: 240 },
    "VND-INFOTECH": { x: 420, y: 240 },
    "ACC-SBIN-1002": { x: 720, y: 240 }
  };

  // Compute dynamic positions for custom dataset nodes so they never overlap
  const nodePositions: Record<string, { x: number; y: number }> = { ...baseNodePositions };
  const agencyNodes = data.nodes.filter(n => n.type === 'agency');
  const vendorNodes = data.nodes.filter(n => n.type === 'vendor');
  const accountNodes = data.nodes.filter(n => n.type === 'bank_account');

  agencyNodes.forEach((n, idx) => {
    if (!baseNodePositions[n.id]) {
      const step = 400 / (agencyNodes.length + 1);
      nodePositions[n.id] = { x: 140, y: Math.round(step * (idx + 1)) };
    }
  });

  vendorNodes.forEach((n, idx) => {
    if (!baseNodePositions[n.id]) {
      const step = 400 / (vendorNodes.length + 1);
      nodePositions[n.id] = { x: 430, y: Math.round(step * (idx + 1)) };
    }
  });

  accountNodes.forEach((n, idx) => {
    if (!baseNodePositions[n.id]) {
      const step = 400 / (accountNodes.length + 1);
      nodePositions[n.id] = { x: 720, y: Math.round(step * (idx + 1)) };
    }
  });

  const getNodeColor = (node: VendorNode) => {
    if (node.type === 'agency') return '#3B82F6';
    if (node.riskFlag === 'SHELL_COMPANY') return '#F43F5E';
    if (node.riskFlag === 'SHARED_ACCOUNT') return '#F59E0B';
    if (node.type === 'bank_account') return '#8B5CF6';
    return '#06B6D4';
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' }}>
      
      {/* Main Graph Canvas / SVG Container */}
      <div className="glass-panel" style={{ padding: '20px', position: 'relative' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Network size={20} color="#06B6D4" />
              Vendor & Contractor Entity Graph
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
              Resolves canonical vendor names, bank account routing, and cross-agency shell rotation patterns.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="badge badge-high" style={{ fontSize: '0.7rem' }}>
              <AlertTriangle size={12} /> {data.shellIndicatorsCount} Shell Flags
            </span>
            <span className="badge badge-violet" style={{ fontSize: '0.7rem' }}>
              {data.rotationClusterCount} Rotation Cluster
            </span>
          </div>
        </div>

        {/* Interactive SVG Network Graph */}
        <div style={{
          width: '100%',
          height: '440px',
          background: 'rgba(7, 10, 17, 0.7)',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          position: 'relative',
          overflow: 'hidden'
        }}>

          {/* SVG Edges and Nodes */}
          <svg width="100%" height="100%" viewBox="0 0 860 480" preserveAspectRatio="xMidYMid meet">
            
            {/* Background Grid Pattern */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              </pattern>
              
              <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Edges */}
            {data.edges.map(edge => {
              const src = nodePositions[edge.source] || { x: 140, y: 240 };
              const tgt = nodePositions[edge.target] || { x: 420, y: 240 };
              const isHighRisk = !!edge.sharedAccountPrefix;

              return (
                <g key={edge.id}>
                  <line
                    x1={src.x}
                    y1={src.y}
                    x2={tgt.x}
                    y2={tgt.y}
                    stroke={isHighRisk ? '#F43F5E' : 'rgba(148, 163, 184, 0.3)'}
                    strokeWidth={isHighRisk ? 3 : 1.5}
                    strokeDasharray={isHighRisk ? '6 4' : 'none'}
                  />
                  {/* Amount Badge on Edge */}
                  <rect
                    x={(src.x + tgt.x) / 2 - 32}
                    y={(src.y + tgt.y) / 2 - 10}
                    width="64"
                    height="20"
                    rx="4"
                    fill="rgba(15, 23, 42, 0.9)"
                    stroke={isHighRisk ? '#F43F5E' : 'rgba(255,255,255,0.1)'}
                    strokeWidth="1"
                  />
                  <text
                    x={(src.x + tgt.x) / 2}
                    y={(src.y + tgt.y) / 2 + 3}
                    fill={isHighRisk ? '#F43F5E' : '#94A3B8'}
                    fontSize="10"
                    fontWeight="600"
                    textAnchor="middle"
                    className="mono"
                  >
                    ₹{(edge.totalAmount / 100000).toFixed(1)}L
                  </text>
                </g>
              );
            })}

            {/* Nodes */}
            {data.nodes.map(node => {
              const pos = nodePositions[node.id] || { x: 420, y: 240 };
              const isSelected = selectedNode?.id === node.id;
              const color = getNodeColor(node);
              const isShell = node.riskFlag === 'SHELL_COMPANY' || node.riskFlag === 'SHARED_ACCOUNT';

              return (
                <g
                  key={node.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedNode(node)}
                >
                  {/* Selection Ring */}
                  {isSelected && (
                    <circle r="26" fill="none" stroke="#06B6D4" strokeWidth="2" strokeDasharray="4 2" />
                  )}

                  {/* Node Circle */}
                  <circle
                    r="20"
                    fill={color}
                    opacity={0.85}
                    stroke="#FFFFFF"
                    strokeWidth={isSelected ? 2.5 : 1}
                    filter={isShell ? 'url(#glow-red)' : undefined}
                  />

                  {/* Node Icon/Label */}
                  <text fill="#FFFFFF" fontSize="11" fontWeight="700" textAnchor="middle" dy="4">
                    {node.type === 'agency' ? 'AGY' : node.type === 'bank_account' ? 'ACC' : 'VND'}
                  </text>

                  {/* Title Label Below */}
                  <text
                    fill="#F8FAFC"
                    fontSize="11"
                    fontWeight="600"
                    textAnchor="middle"
                    dy="36"
                    style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
                  >
                    {node.canonicalName}
                  </text>
                </g>
              );
            })}

          </svg>

          {/* Graph Legend Overlay */}
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            display: 'flex',
            gap: '12px',
            background: 'rgba(15, 23, 42, 0.85)',
            padding: '6px 12px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            fontSize: '0.75rem',
            color: '#94A3B8'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3B82F6' }}></span> Agency
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#06B6D4' }}></span> Normal Vendor
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F43F5E' }}></span> Shell Vendor
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#8B5CF6' }}></span> Shared Account
            </span>
          </div>

        </div>

      </div>

      {/* Selected Node Details Sidebar */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h4 style={{ fontSize: '0.95rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Entity Inspector
        </h4>

        {selectedNode ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: getNodeColor(selectedNode),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFF'
              }}>
                {selectedNode.type === 'agency' ? <Building size={20} /> : selectedNode.type === 'bank_account' ? <CreditCard size={20} /> : <ShieldAlert size={20} />}
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', margin: 0 }}>{selectedNode.canonicalName}</h4>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }} className="mono">{selectedNode.id}</span>
              </div>
            </div>

            {selectedNode.riskFlag && (
              <div style={{
                background: selectedNode.riskFlag === 'NORMAL' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.15)',
                border: selectedNode.riskFlag === 'NORMAL' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(244, 63, 94, 0.4)',
                borderRadius: '8px',
                padding: '10px',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: selectedNode.riskFlag === 'NORMAL' ? '#10B981' : '#F43F5E' }}>
                  {selectedNode.riskFlag === 'NORMAL' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                  {selectedNode.riskFlag.replace('_', ' ')}
                </div>
                {selectedNode.accountPrefix && (
                  <p style={{ fontSize: '0.75rem', color: '#CBD5E1', marginTop: '4px' }}>
                    Shared Account Prefix: <span className="mono" style={{ color: '#F59E0B' }}>{selectedNode.accountPrefix}*</span>
                  </p>
                )}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                <span style={{ color: '#94A3B8' }}>Entity Type:</span>
                <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{selectedNode.type}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                <span style={{ color: '#94A3B8' }}>Region Jurisdiction:</span>
                <span style={{ fontWeight: 600 }}>{selectedNode.region}</span>
              </div>

              <div>
                <span style={{ color: '#94A3B8', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>Name Variants Canonicalized:</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {selectedNode.nameVariants.map((v, i) => (
                    <span key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', color: '#CBD5E1' }}>
                      • {v}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div style={{ color: '#64748b', fontSize: '0.85rem', textAlign: 'center', padding: '40px 0' }}>
            <Info size={24} style={{ display: 'block', margin: '0 auto 8px' }} />
            Click on any node in the graph to inspect entity resolution and bank routing details.
          </div>
        )}
      </div>

    </div>
  );
};
