import React, { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, CheckCircle2, Loader2, Sparkles, RefreshCw, X, AlertCircle } from 'lucide-react';
import { parseCSVToEvidence, SAMPLE_CSV_CONTENT } from '../utils/csvParser';
import { EvidenceObject, OverviewMetrics } from '../types/mplads';

interface IngestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onDatasetParsed?: (data: { evidenceItems: EvidenceObject[]; metrics: OverviewMetrics }) => void;
  onResetDataset?: () => void;
}

export const IngestionModal: React.FC<IngestionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onDatasetParsed,
  onResetDataset
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const pipelineSteps = [
    "Raw CSV Data Parsing & Normalization (Canonicalizing agency & vendor entities)",
    "Agency Behavioral Baseline Calculation (Computing mean, Z-scores, IQR dispersion)",
    "Vendor Graph Construction (Resolving shell companies & bank account clusters)",
    "Ground-Truth Engine (Extracting EXIF geotags & photo presence check)",
    "Cost-Realism Benchmarking (Cross-checking unit rates against CPWD/PWD SOR)",
    "Composite Anomaly Priority Score Aggregation & Store Evidence Objects"
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setParseError(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      setParseError(null);
    }
  };

  const executePipeline = (csvText: string, isReset: boolean = false) => {
    setIsProcessing(true);
    setCurrentStep(0);
    setParseError(null);

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= pipelineSteps.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            setIsProcessing(false);
            
            if (isReset && onResetDataset) {
              onResetDataset();
            } else {
              try {
                const parsed = parseCSVToEvidence(csvText);
                if (onDatasetParsed) {
                  onDatasetParsed({
                    evidenceItems: parsed.evidenceItems,
                    metrics: parsed.metrics
                  });
                }
              } catch (err: any) {
                setParseError(err?.message || "Failed to parse CSV file schema.");
                return;
              }
            }

            onSuccess();
            onClose();
          }, 600);
          return prev;
        }
        return prev + 1;
      });
    }, 500);
  };

  const handleRunPipeline = () => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target?.result as string;
        if (text) {
          executePipeline(text, false);
        } else {
          setParseError("Could not read content from selected file.");
        }
      };
      reader.onerror = () => {
        setParseError("Error reading file from disk.");
      };
      reader.readAsText(selectedFile);
    } else {
      // Run pipeline on sample CSV if no custom file selected
      executePipeline(SAMPLE_CSV_CONTENT, false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    executePipeline(SAMPLE_CSV_CONTENT, true);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(7, 10, 17, 0.85)',
      backdropFilter: 'blur(12px)',
      zIndex: 999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '640px', padding: '28px', position: 'relative' }}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'transparent',
            border: 'none',
            color: '#94A3B8',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'rgba(6, 182, 212, 0.15)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#06B6D4'
          }}>
            <FileSpreadsheet size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: '#F8FAFC', margin: 0 }}>
              Ingest MPLADS Expenditure Dataset
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: 0 }}>
              Upload CSV/XLSX or run pipeline on constituency transaction dataset.
            </p>
          </div>
        </div>

        {parseError && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.12)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: '8px',
            padding: '10px 14px',
            marginBottom: '16px',
            color: '#F43F5E',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} />
            <span>{parseError}</span>
          </div>
        )}

        {!isProcessing ? (
          <div>
            {/* Drag & Drop Upload Zone */}
            <div
              style={{
                border: isDragOver ? '2px dashed #06B6D4' : '2px dashed var(--border-highlight)',
                borderRadius: '12px',
                padding: '32px 20px',
                textAlign: 'center',
                background: isDragOver ? 'rgba(6, 182, 212, 0.1)' : 'rgba(15, 23, 42, 0.4)',
                cursor: 'pointer',
                marginBottom: '20px',
                transition: 'all 0.2s ease'
              }}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
            >
              <Upload size={36} color="#06B6D4" style={{ display: 'block', margin: '0 auto 12px' }} />
              <h4 style={{ fontSize: '1rem', color: '#CBD5E1', margin: '0 0 4px 0' }}>
                {selectedFile ? `Selected: ${selectedFile.name}` : 'Drag & Drop Constituency Expenditure CSV'}
              </h4>
              <p style={{ fontSize: '0.75rem', color: selectedFile ? '#10B981' : '#64748B', margin: 0 }}>
                {selectedFile
                  ? `File ready (${(selectedFile.size / 1024).toFixed(1)} KB). Click 'Run Pipeline' below.`
                  : 'Click to browse or drag & drop standard MPLADS export (.csv, .xlsx)'}
              </p>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept=".csv, .xlsx, .xls"
              hidden
              onChange={handleFileChange}
            />

            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleRunPipeline}>
                <Sparkles size={16} /> Run Pipeline {selectedFile ? 'on Selected File' : 'on Sample CSV'}
              </button>

              <button className="btn btn-secondary" onClick={handleReset}>
                <RefreshCw size={16} /> Reset to Pre-seeded SIH Demo Dataset
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h4 style={{ fontSize: '0.95rem', color: '#06B6D4', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Loader2 size={18} className="animate-pulse" /> Running Data Normalization & Intelligence Pipeline...
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {pipelineSteps.map((step, idx) => {
                const isDone = idx < currentStep;
                const isCurrent = idx === currentStep;

                return (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '0.825rem',
                    color: isDone ? '#10B981' : isCurrent ? '#F8FAFC' : '#64748B',
                    fontWeight: isCurrent ? 600 : 400
                  }}>
                    {isDone ? (
                      <CheckCircle2 size={18} color="#10B981" />
                    ) : isCurrent ? (
                      <Loader2 size={18} color="#06B6D4" style={{ animation: 'spin 1s linear infinite' }} />
                    ) : (
                      <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid #334155' }} />
                    )}
                    <span>Step {idx + 1}: {step}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
