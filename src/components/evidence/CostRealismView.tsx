import React from 'react';
import { CostRealismFlag } from '../../types/mplads';
import { DollarSign, TrendingUp, BookOpen, AlertCircle, CheckCircle, Calculator } from 'lucide-react';

interface CostRealismViewProps {
  data: CostRealismFlag;
  sanctionAmount: number;
}

export const CostRealismView: React.FC<CostRealismViewProps> = ({ data, sanctionAmount }) => {
  const isOverpriced = data.direction === 'OVER';
  const ratio = (data.actualUnitCost / data.referenceUnitCost).toFixed(2);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
      
      {/* SOR Comparison Chart & Metrics */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <DollarSign size={20} color="#F59E0B" />
              Schedule of Rates (SOR) Benchmarking
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
              Independent price-realism verification against PWD/CPWD official Schedule of Rates.
            </p>
          </div>

          <span className={`badge ${isOverpriced ? 'badge-high' : 'badge-low'}`}>
            <TrendingUp size={12} /> {data.deviationPct.toFixed(1)}% {data.direction} Benchmark
          </span>
        </div>

        {/* Unit Cost Comparison Bar Visualizer */}
        <div style={{ background: 'rgba(7, 10, 17, 0.7)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
          <span style={{ fontSize: '0.8rem', color: '#94A3B8', display: 'block', marginBottom: '16px' }}>
            Unit Rate Benchmark: <strong style={{ color: '#F8FAFC' }}>{data.workCategory}</strong>
          </span>

          {/* Reference SOR Bar */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
              <span style={{ color: '#94A3B8' }}>CPWD/PWD Benchmark Rate ({data.unit}):</span>
              <span className="mono" style={{ color: '#10B981', fontWeight: 600 }}>
                ₹{data.referenceUnitCost.toLocaleString()} / {data.unit}
              </span>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: '40%', background: '#10B981' }} />
            </div>
          </div>

          {/* Actual Billed Bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
              <span style={{ color: '#94A3B8' }}>Actual Billed Unit Rate ({data.unit}):</span>
              <span className="mono" style={{ color: isOverpriced ? '#F43F5E' : '#06B6D4', fontWeight: 700 }}>
                ₹{data.actualUnitCost.toLocaleString()} / {data.unit} ({ratio}x SOR)
              </span>
            </div>
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${Math.min(100, 40 * parseFloat(ratio))}%`,
                  background: isOverpriced ? '#F43F5E' : '#06B6D4'
                }}
              />
            </div>
          </div>
        </div>

        {/* Source SOR Reference Citation */}
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <BookOpen size={20} color="#06B6D4" style={{ marginTop: '2px', flexShrink: 0 }} />
          <div>
            <h4 style={{ fontSize: '0.85rem', color: '#F8FAFC', margin: 0 }}>Reference Document Citation:</h4>
            <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: '4px 0 0 0' }}>
              {data.sorReference.source} ({data.sorReference.region}, Year {data.sorReference.year}) — Item ID: <span className="mono" style={{ color: '#06B6D4' }}>{data.sorReference.sorId}</span>
            </p>
          </div>
        </div>

      </div>

      {/* Financial Impact & Deviation Summary Sidebar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Excess Cost Impact Card */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.8rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Estimated Financial Impact
          </span>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '8px', marginBottom: '8px' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: isOverpriced ? '#F43F5E' : '#10B981' }}>
              ₹{data.totalExcessCost.toLocaleString()}
            </h2>
          </div>

          <span style={{ fontSize: '0.8rem', color: isOverpriced ? '#F43F5E' : '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
            {isOverpriced ? <AlertCircle size={14} /> : <CheckCircle size={14} />}
            {isOverpriced ? 'Excess expenditure paid above benchmark' : 'Within reference cost tolerance'}
          </span>

          <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94A3B8' }}>Total Quantity:</span>
              <span className="mono" style={{ fontWeight: 600 }}>{data.quantity} {data.unit}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94A3B8' }}>Sanctioned Total:</span>
              <span className="mono" style={{ fontWeight: 600 }}>₹{sanctionAmount.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94A3B8' }}>Benchmark Total:</span>
              <span className="mono" style={{ fontWeight: 600, color: '#10B981' }}>₹{(data.quantity * data.referenceUnitCost).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Cost Realism Intelligence Note */}
        <div className="glass-panel" style={{ padding: '20px', flex: 1, background: 'rgba(245, 158, 11, 0.05)', borderColor: 'rgba(245, 158, 11, 0.2)' }}>
          <h4 style={{ fontSize: '0.9rem', color: '#F59E0B', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Calculator size={16} /> Auditor Key Insight
          </h4>
          <p style={{ fontSize: '0.8rem', color: '#CBD5E1', lineHeight: '1.5' }}>
            This signal operates independently of agency behavioral novelty. Even if an agency has historically paid over-market rates, the Cost-Realism engine flags systematic inflation against CPWD/PWD standard schedules.
          </p>
        </div>

      </div>

    </div>
  );
};
