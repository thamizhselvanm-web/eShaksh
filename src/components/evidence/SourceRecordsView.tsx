import React, { useState } from 'react';
import { SourceRecord } from '../../types/mplads';
import { Database, Search, Download, CreditCard, FileText } from 'lucide-react';

interface SourceRecordsViewProps {
  records: SourceRecord[];
  workTitle: string;
}

export const SourceRecordsView: React.FC<SourceRecordsViewProps> = ({ records, workTitle }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecords = records.filter(r => 
    r.txnId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.sanctionOrderNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.workDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="glass-panel" style={{ padding: '20px' }}>
      
      {/* Header & Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={20} color="#06B6D4" />
            Raw Source Expenditure Records
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
            Direct lineage to raw transaction logs. Grounded evidence without black-box aggregation.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <Search size={14} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search TXN ID, vendor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                padding: '6px 12px 6px 30px',
                color: '#F8FAFC',
                fontSize: '0.8rem',
                outline: 'none',
                width: '200px'
              }}
            />
          </div>

          <button className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '6px 12px' }}>
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: '#94A3B8', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.05em' }}>
              <th style={{ padding: '10px 12px' }}>TXN ID</th>
              <th style={{ padding: '10px 12px' }}>Date</th>
              <th style={{ padding: '10px 12px' }}>Executing Agency</th>
              <th style={{ padding: '10px 12px' }}>Vendor Beneficiary</th>
              <th style={{ padding: '10px 12px' }}>Milestone / Description</th>
              <th style={{ padding: '10px 12px' }}>Sanction Order</th>
              <th style={{ padding: '10px 12px' }}>Bank Account Hash</th>
              <th style={{ padding: '10px 12px', textAlign: 'right' }}>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((r, idx) => (
              <tr key={r.txnId} style={{ borderBottom: '1px solid var(--border-color)', background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                <td style={{ padding: '12px' }} className="mono">
                  <span style={{ color: '#06B6D4', fontWeight: 600 }}>{r.txnId}</span>
                </td>
                <td style={{ padding: '12px', color: '#CBD5E1' }}>{r.date}</td>
                <td style={{ padding: '12px', fontWeight: 600 }}>{r.agencyName}</td>
                <td style={{ padding: '12px', color: '#F8FAFC' }}>{r.vendorName}</td>
                <td style={{ padding: '12px', color: '#94A3B8' }}>{r.workDescription}</td>
                <td style={{ padding: '12px' }} className="mono">{r.sanctionOrderNo}</td>
                <td style={{ padding: '12px' }} className="mono">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#F59E0B' }}>
                    <CreditCard size={12} /> {r.bankAccountHash}
                  </span>
                </td>
                <td style={{ padding: '12px', textAlign: 'right', fontWeight: 700, color: '#F8FAFC' }} className="mono">
                  ₹{r.amount.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
