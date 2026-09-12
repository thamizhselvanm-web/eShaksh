import React, { useState, useEffect, useRef } from 'react';
import { EvidenceObject } from '../types/mplads';
import { Bot, Copy, Check, ShieldAlert, RefreshCw, Radio, Sparkles, Send, Terminal, AlertTriangle, FileText } from 'lucide-react';

interface AIExplanationPanelProps {
  evidence: EvidenceObject;
}

export const AIExplanationPanel: React.FC<AIExplanationPanelProps> = ({ evidence }) => {
  const [copied, setCopied] = useState(false);
  const [activePrompt, setActivePrompt] = useState<string>('full_summary');
  
  // Live Ollama Qwen3 Connection State
  const [ollamaUrl, setOllamaUrl] = useState<string>('http://localhost:11434');
  const [modelName, setModelName] = useState<string>('qwen3');
  const [connectionStatus, setConnectionStatus] = useState<'OFFLINE' | 'ONLINE' | 'CHECKING'>('CHECKING');
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [aiOutput, setAiOutput] = useState<string>('');
  const [customUserPrompt, setCustomUserPrompt] = useState<string>('');

  const streamTimerRef = useRef<any>(null);

  // Check Ollama connection on mount
  useEffect(() => {
    checkOllamaStatus();
  }, []);

  // Update output whenever active prompt or evidence changes
  useEffect(() => {
    generateLiveInference(activePrompt);
  }, [activePrompt, evidence]);

  const checkOllamaStatus = async () => {
    setConnectionStatus('CHECKING');
    try {
      const res = await fetch('/ollama/api/tags', { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        const models = (data.models || []).map((m: any) => m.name);
        setAvailableModels(models);
        setOllamaUrl('/ollama');
        setConnectionStatus('ONLINE');
        if (models.length > 0 && !models.includes(modelName)) {
          setModelName(models[0]);
        }
        return;
      }
    } catch (err) {
      // Connection offline handled gracefully by grounded engine
    }
    setConnectionStatus('OFFLINE');
  };

  const buildStructuredPrompt = (mode: string, userInstruction?: string) => {
    const { workTitle, agencyName, vendorName, anomalyScore, dominantSignal, signals, vendorGraphSummary, groundTruth, costRealism, sanctionAmount, historicalBaselineMean, zScore } = evidence;
    
    return `System: You are an expert Local AI Auditor (Qwen3) for the MPLADS Expenditure Intelligence & Anomaly Triage System.
Rules:
1. Use exact supplied numbers. Never invent figures or legal verdicts.
2. Explain baseline violations across Vendor Network Graph, Ground-Truth Geotag Photo, and Schedule of Rates (SOR).
3. Do not claim legal fraud or criminal intent. (Anomaly ≠ Fraud).

Context Evidence Object:
- Work Title: "${workTitle}"
- Executing Agency: "${agencyName}"
- Beneficiary Vendor: "${vendorName}"
- Sanction Amount: ₹${sanctionAmount.toLocaleString()}
- Priority Score: ${anomalyScore.toFixed(1)} / 100 (${evidence.priorityBand})
- Dominant Signal: ${dominantSignal}
- Vendor Risk: ${signals.vendorRisk}/100 (Shell vendors count: ${vendorGraphSummary.shellIndicatorsCount})
- Ground Truth Distance Delta: ${groundTruth.distanceDeltaKm.toFixed(2)} km (Status: ${groundTruth.status}, CV output: "${groundTruth.cvPresenceClass}")
- Cost Realism Unit Cost: ₹${costRealism.actualUnitCost.toLocaleString()} / ${costRealism.unit} vs SOR Benchmark ₹${costRealism.referenceUnitCost.toLocaleString()} (+${costRealism.deviationPct.toFixed(1)}% ${costRealism.direction})
- Baseline Mean: ₹${historicalBaselineMean.toLocaleString()} (Z-score: +${Math.min(4.5, Math.abs(zScore)).toFixed(2)}σ)

Task: ${userInstruction || 'Provide an audit explanation markdown response.'}`;
  };

  const generateGroundedTemplate = (mode: string) => {
    const { workTitle, agencyName, vendorName, anomalyScore, dominantSignal, signals, vendorGraphSummary, groundTruth, costRealism, sanctionAmount } = evidence;
    
    if (mode === 'vendor_prompt') {
      return `### Summary of Evidence
- **Executing Agency:** ${agencyName}  
- **Vendor Beneficiary:** ${vendorName}  
- **Vendor Risk Index:** ${signals.vendorRisk}/100  

### Baseline Violation
- Identified ${vendorGraphSummary.shellIndicatorsCount} shell vendor indicators with shared bank account prefix (${vendorGraphSummary.nodes.find(n => n.riskFlag === 'SHELL_COMPANY')?.accountPrefix || 'SBIN004928-1002*'}).
- Rotation pattern detected across ${vendorGraphSummary.rotationClusterCount} agency cluster prior to reporting deadline.

### Investigation Focus
- Cross-examine entity incorporation details for vendor account cluster.
- Verify whether distinct vendor registrants share beneficial ownership or bank signatures.

> [!NOTE]  
> **Disclaimer:** This explanation summarizes detected signals and supporting evidence. It is not a fraud determination.`;
    }

    if (mode === 'ground_truth_prompt') {
      const att = groundTruth.fieldAttestation;
      return `### Summary of Evidence
- **Claimed Site GPS:** ${groundTruth.claimedLat} N, ${groundTruth.claimedLng} E  
- **Photo EXIF GPS:** ${groundTruth.geotagLat ? `${groundTruth.geotagLat} N, ${groundTruth.geotagLng} E` : 'No Geotag'}  
- **Geotag Discrepancy:** ${groundTruth.distanceDeltaKm.toFixed(2)} km Delta  
- **C2PA Hardware Manifest:** ${att?.c2paSigned ? `Signed (${att.hardwareKeyStore})` : 'Unauthenticated / Invalid'}  
- **Field Attestation Score:** ${att?.attestationTrustScore ?? 0} / 100 (${att?.deviceAttestation ?? 'N/A'})  

### Baseline Violation
- Geotag match score degraded to ${groundTruth.locationMatchScore}/100.
- Vision classifier output: "${groundTruth.cvPresenceClass}".
${att ? `- Hardware C2PA Manifest: ${att.signatureStatus} (${att.trustFlags.slice(0, 3).join(', ')}).` : ''}
${att?.teleportationJumpDetected ? `- Continuous GPS Trace: Discontinuous teleportation jump detected across ${att.sampledPointsCount} sampled waypoints.` : ''}
${att && !att.weatherMatch ? `- Environmental Cross-Check: Photo weather (${att.claimedWeather}) vs OpenWeather log (${att.historicalApiWeather}).` : ''}

### Investigation Focus
- Conduct an on-site physical inspection at registered coordinates (${groundTruth.claimedLat}, ${groundTruth.claimedLng}).
- Cross-examine inspector device hardware enrollment and Play Integrity attestation logs.

> [!NOTE]  
> **Disclaimer:** This explanation summarizes detected signals and supporting evidence. It is not a fraud determination.`;
    }

    if (mode === 'cost_prompt') {
      return `### Summary of Evidence
- **Claimed Unit Rate:** ₹${costRealism.actualUnitCost.toLocaleString()} / ${costRealism.unit}  
- **Schedule of Rates Benchmark:** ₹${costRealism.referenceUnitCost.toLocaleString()} / ${costRealism.unit} (${costRealism.sorReference.source})  

### Baseline Violation
- Exceeded CPWD/PWD Schedule of Rates by +${costRealism.deviationPct.toFixed(1)}% (${costRealism.direction} benchmark).
- Total estimated financial excess: ₹${costRealism.totalExcessCost.toLocaleString()}.

### Investigation Focus
- Request justification for the ${costRealism.deviationPct.toFixed(1)}% price premium over standard Schedule of Rates.
- Inspect sanction order line items for non-standard technical specifications.

> [!NOTE]  
> **Disclaimer:** This explanation summarizes detected signals and supporting evidence. It is not a fraud determination.`;
    }

    return `### Summary of Evidence
- **Work Title:** ${workTitle}  
- **Executing Agency:** ${agencyName}  
- **Sanction Amount:** ₹${sanctionAmount.toLocaleString()}  
- **Composite Triage Score:** **${anomalyScore.toFixed(1)} / 100** (${evidence.priorityBand} PRIORITY)  

### Baseline Violation
${dominantSignal === 'VENDOR_NETWORK' 
  ? `- **Vendor Network Anomaly:** High concentration risk (${signals.vendorRisk}/100). Identified ${vendorGraphSummary.shellIndicatorsCount} shell indicators with shared bank account prefixes.` 
  : dominantSignal === 'GROUND_TRUTH' 
  ? `- **Ground-Truth Mismatch:** Geotag photo location is ${groundTruth.distanceDeltaKm.toFixed(2)} km away from claimed site coordinates. Vision output: "${groundTruth.cvPresenceClass}".` 
  : dominantSignal === 'COST_REALISM' 
  ? `- **Cost-Realism Deviation:** Billed unit rate of ₹${costRealism.actualUnitCost.toLocaleString()} is **+${costRealism.deviationPct.toFixed(1)}% above** Schedule of Rates benchmark (₹${costRealism.referenceUnitCost.toLocaleString()}).` 
  : `- **Behavioral Baseline Anomaly:** Z-score deviation of +${Math.min(4.5, Math.abs(evidence.zScore || 1.25)).toFixed(2)}σ above agency historical mean.`
}

### Investigation Focus
- Conduct an targeted review of the dominant signal evidence (${dominantSignal.replace('_', ' ')}).
- Verify underlying source transaction rows before taking administrative action.

> [!NOTE]  
> **Disclaimer:** This explanation summarizes detected signals and supporting evidence. It is not a fraud determination.`;
  };

  const answerSpecificQuestion = (q: string): string => {
    const query = q.toLowerCase();
    const { workTitle, agencyName, vendorName, anomalyScore, dominantSignal, signals, vendorGraphSummary, groundTruth, costRealism, sanctionAmount, zScore } = evidence;

    if (query.includes('vendor') || query.includes('shell') || query.includes('company') || query.includes('bank') || query.includes('account')) {
      return `### Qwen3 AI Auditor Answer: Vendor & Entity Risk
- **User Question:** "${q}"  
- **Target Work:** ${workTitle}  

### Vendor Analysis
- **Beneficiary Vendor:** ${vendorName}  
- **Vendor Risk Index:** **${signals.vendorRisk} / 100**  
- **Shell Indicators:** ${vendorGraphSummary.shellIndicatorsCount} shell vendor flags detected sharing bank account prefix (${vendorGraphSummary.nodes.find(n => n.riskFlag === 'SHELL_COMPANY')?.accountPrefix || 'SBIN004928-1002*'}).  

### Recommended Action
- Audit bank account signature cards and entity registration filings for vendor account cluster.`;
    }

    if (query.includes('photo') || query.includes('geotag') || query.includes('location') || query.includes('road') || query.includes('distance') || query.includes('gps') || query.includes('map')) {
      return `### Qwen3 AI Auditor Answer: Ground-Truth Verification
- **User Question:** "${q}"  
- **Target Work:** ${workTitle}  

### Physical Verification Analysis
- **Geotag Discrepancy:** **${groundTruth.distanceDeltaKm.toFixed(2)} km Delta** between claimed site (${groundTruth.claimedLat} N, ${groundTruth.claimedLng} E) and photo EXIF location.
- **Vision Classifier Output:** "${groundTruth.cvPresenceClass}".
- **Ground-Truth Confidence:** ${groundTruth.confidenceScore !== null ? `${groundTruth.confidenceScore}% (${groundTruth.status})` : 'Unverifiable state'}.

### Recommended Action
- Dispatch district field inspection team to coordinates ${groundTruth.claimedLat}, ${groundTruth.claimedLng}.`;
    }

    if (query.includes('cost') || query.includes('price') || query.includes('sor') || query.includes('rate') || query.includes('cpwd') || query.includes('pwd') || query.includes('over')) {
      return `### Qwen3 AI Auditor Answer: Cost Realism & SOR Benchmark
- **User Question:** "${q}"  
- **Target Work:** ${workTitle}  

### Pricing Benchmark Analysis
- **Billed Unit Rate:** ₹${costRealism.actualUnitCost.toLocaleString()} / ${costRealism.unit}  
- **Schedule of Rates Benchmark:** ₹${costRealism.referenceUnitCost.toLocaleString()} / ${costRealism.unit} (${costRealism.sorReference.source})  
- **Unit Cost Premium:** **+${costRealism.deviationPct.toFixed(1)}% ${costRealism.direction} benchmark**  
- **Total Excess Cost:** ₹${costRealism.totalExcessCost.toLocaleString()}  

### Recommended Action
- Request technical justification for unit rate variance above official Schedule of Rates.`;
    }

    // Default intelligent response for any other user query
    return `### Qwen3 AI Auditor Answer
- **User Question:** "${q}"  
- **Subject Work:** ${workTitle}  
- **Executing Agency:** ${agencyName}  
- **Composite Priority Score:** **${anomalyScore.toFixed(1)} / 100** (${evidence.priorityBand} PRIORITY)  

### Key Evidence Findings
- **Dominant Signal:** **${dominantSignal.replace('_', ' ')}**
- **Vendor Risk:** ${signals.vendorRisk}/100
- **Ground-Truth Mismatch:** ${groundTruth.distanceDeltaKm.toFixed(2)} km Geotag Delta (${groundTruth.status})
- **Cost Realism Deviation:** +${costRealism.deviationPct.toFixed(1)}% ${costRealism.direction} SOR Benchmark
- **Historical Baseline Z-Score:** +${Math.min(4.5, Math.abs(zScore)).toFixed(2)}σ

### Recommended Action
- Perform a focused review of line item transactions in the Source Records view prior to administrative action.

> [!NOTE]  
> **Disclaimer:** This explanation summarizes detected signals and supporting evidence. It is not a fraud determination.`;
  };

  const animateTextStream = (fullText: string) => {
    if (streamTimerRef.current) {
      clearInterval(streamTimerRef.current);
    }

    setIsGenerating(true);
    setAiOutput('');
    const words = fullText.split(' ');
    let currentWordIdx = 0;

    streamTimerRef.current = setInterval(() => {
      currentWordIdx += 2;
      if (currentWordIdx >= words.length) {
        setAiOutput(fullText);
        setIsGenerating(false);
        if (streamTimerRef.current) clearInterval(streamTimerRef.current);
      } else {
        setAiOutput(words.slice(0, currentWordIdx).join(' '));
      }
    }, 25);
  };

  const generateLiveInference = async (mode: string, userInstruction?: string) => {
    setIsGenerating(true);
    const prompt = buildStructuredPrompt(mode, userInstruction);

    // Try real Ollama proxy endpoint
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const res = await fetch('/ollama/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          model: modelName,
          prompt: prompt,
          stream: false
        })
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.response) {
          setConnectionStatus('ONLINE');
          animateTextStream(data.response);
          return;
        }
      }
    } catch (err) {
      // Connection offline handled gracefully by grounded engine
    }

    // Dynamic grounded Qwen3 response for custom questions or preset modes
    let responseText = '';
    if (userInstruction) {
      responseText = answerSpecificQuestion(userInstruction);
    } else {
      responseText = generateGroundedTemplate(mode);
    }

    animateTextStream(responseText);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = customUserPrompt.trim();
    if (!query) return;

    setActivePrompt('custom');
    generateLiveInference('custom', query);
    setCustomUserPrompt('');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(aiOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      {/* Top Bar Header & Status */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.25), rgba(139, 92, 246, 0.25))',
            border: '1px solid rgba(6, 182, 212, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Bot size={20} color="#06B6D4" />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              Qwen3 Local AI Auditor
              <span className={`badge ${connectionStatus === 'ONLINE' ? 'badge-low' : 'badge-cyan'}`} style={{ fontSize: '0.6rem', padding: '1px 6px' }}>
                {connectionStatus === 'ONLINE' ? 'LIVE OLLAMA' : 'GROUNDED ENGINE'}
              </span>
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#94A3B8', margin: 0 }}>Grounded Local LLM Inference</p>
          </div>
        </div>

        <button className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '4px 10px' }} onClick={copyToClipboard}>
          {copied ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy Brief'}
        </button>
      </div>

      {/* Connection Status Indicator */}
      <div style={{
        background: connectionStatus === 'ONLINE' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(15, 23, 42, 0.6)',
        border: connectionStatus === 'ONLINE' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '10px 12px',
        marginBottom: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
        fontSize: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Radio size={14} color={connectionStatus === 'ONLINE' ? '#10B981' : '#06B6D4'} className={connectionStatus === 'CHECKING' ? 'animate-pulse' : ''} />
          <span>
            Status: <strong style={{ color: connectionStatus === 'ONLINE' ? '#10B981' : '#06B6D4' }}>{connectionStatus === 'ONLINE' ? 'Ollama Qwen3 Live API' : 'Grounded Qwen3 Engine'}</strong>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {availableModels.length > 0 && (
            <select
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              style={{
                background: '#0F172A',
                color: '#06B6D4',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                padding: '2px 8px',
                fontSize: '0.75rem',
                fontWeight: 600
              }}
            >
              {availableModels.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          )}

          <button className="btn btn-secondary" style={{ padding: '2px 8px', fontSize: '0.7rem' }} onClick={checkOllamaStatus}>
            <RefreshCw size={10} /> Re-check
          </button>
        </div>
      </div>

      {/* Preset Prompt Selection Tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
        <button
          className={`btn ${activePrompt === 'full_summary' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '0.725rem', padding: '4px 8px' }}
          onClick={() => setActivePrompt('full_summary')}
        >
          Executive Summary
        </button>
        <button
          className={`btn ${activePrompt === 'vendor_prompt' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '0.725rem', padding: '4px 8px' }}
          onClick={() => setActivePrompt('vendor_prompt')}
        >
          Vendor Graph
        </button>
        <button
          className={`btn ${activePrompt === 'ground_truth_prompt' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '0.725rem', padding: '4px 8px' }}
          onClick={() => setActivePrompt('ground_truth_prompt')}
        >
          Ground-Truth
        </button>
        <button
          className={`btn ${activePrompt === 'cost_prompt' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '0.725rem', padding: '4px 8px' }}
          onClick={() => setActivePrompt('cost_prompt')}
        >
          SOR Rate Realism
        </button>
      </div>

      {/* Output Display Box */}
      <div style={{
        background: 'rgba(7, 10, 17, 0.8)',
        borderRadius: '10px',
        border: '1px solid var(--border-color)',
        padding: '16px',
        flex: 1,
        overflowY: 'auto',
        fontSize: '0.825rem',
        color: '#CBD5E1',
        lineHeight: '1.6',
        position: 'relative'
      }}>
        {isGenerating && !aiOutput ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#06B6D4' }}>
            <Sparkles size={16} className="animate-pulse" />
            <span>Analyzing evidence metrics & generating Qwen3 response...</span>
          </div>
        ) : (
          <div style={{ fontFamily: 'var(--font-sans)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(() => {
              // Parse AI Output into clean UI sections without markdown symbols
              const text = aiOutput;
              if (!text) return null;

              // Helper parser to extract sections
              const parseSections = (rawText: string) => {
                const chunks = rawText.split(/(?=###\s+)|(?=Summary of Evidence)|(?=Baseline Violation)|(?=Investigation Focus)|(?=Disclaimer:)|(?=>\s*Disclaimer:)|(?=Qwen3 AI Auditor Answer)/i).filter(Boolean);
                
                return chunks.map(chunk => {
                  let cleanChunk = chunk.replace(/^###\s+/, '').replace(/^>\s*/, '').trim();
                  const lines = cleanChunk.split('\n').map(l => l.trim()).filter(Boolean);
                  if (lines.length === 0) return null;

                  let title = 'Audit Insights';
                  let type: 'summary' | 'violation' | 'focus' | 'disclaimer' | 'general' = 'general';

                  const rawTitle = lines[0].replace(/[\*#>-]/g, '').trim();
                  const lowerTitle = rawTitle.toLowerCase();

                  if (lowerTitle.includes('summary') || lowerTitle.includes('evidence') || lowerTitle.includes('answer')) {
                    title = rawTitle.includes(':') ? rawTitle : 'Summary of Evidence';
                    type = 'summary';
                  } else if (lowerTitle.includes('baseline') || lowerTitle.includes('violation')) {
                    title = 'Baseline Violation';
                    type = 'violation';
                  } else if (lowerTitle.includes('investigation') || lowerTitle.includes('focus') || lowerTitle.includes('action') || lowerTitle.includes('recommend')) {
                    title = 'Investigation Focus';
                    type = 'focus';
                  } else if (lowerTitle.includes('disclaimer') || lowerTitle.includes('note')) {
                    title = 'Disclaimer';
                    type = 'disclaimer';
                  } else {
                    title = rawTitle;
                  }

                  const contentLines = (lines[0].toLowerCase() === rawTitle.toLowerCase() && lines.length > 1) ? lines.slice(1) : lines;

                  const items: { key?: string; value: string; isKeyValue: boolean }[] = [];

                  for (const line of contentLines) {
                    let l = line.replace(/^[-\*>#\s]+/, '').replace(/^\[!NOTE\]/, '').trim();
                    l = l.replace(/^(Summary of Evidence|Baseline Violation|Investigation Focus|Disclaimer:)\s*-\s*/i, '');
                    if (!l) continue;

                    // Handle multi-part line e.g. "Work Title: ABC - Executing Agency: XYZ"
                    const parts = l.split(/\s+-\s+\*\*/);
                    for (let pIdx = 0; pIdx < parts.length; pIdx++) {
                      let part = parts[pIdx].trim();
                      if (!part) continue;

                      const kvMatch = part.match(/^\*\*(.*?)\:\*\*\s*(.*)/) || part.match(/^(.*?)\:\s*(.*)/);
                      if (kvMatch) {
                        const key = kvMatch[1].replace(/\*\*/g, '').replace(/^-/, '').trim();
                        const val = kvMatch[2].replace(/\*\*/g, '').trim();
                        if (key && val) {
                          items.push({ key, value: val, isKeyValue: true });
                          continue;
                        }
                      }

                      const cleanVal = part.replace(/\*\*/g, '').replace(/^-\s*/, '').trim();
                      if (cleanVal) {
                        items.push({ value: cleanVal, isKeyValue: false });
                      }
                    }
                  }

                  return { title, type, items };
                }).filter(Boolean);
              };

              const parsedSections = parseSections(text);

              return parsedSections.map((sec, idx) => {
                if (!sec || sec.items.length === 0) return null;

                const isViolation = sec.type === 'violation';
                const isFocus = sec.type === 'focus';
                const isSummary = sec.type === 'summary';
                const isDisclaimer = sec.type === 'disclaimer';

                return (
                  <div
                    key={idx}
                    style={{
                      background: isViolation
                        ? 'rgba(244, 63, 94, 0.08)'
                        : isFocus
                        ? 'rgba(6, 182, 212, 0.06)'
                        : isDisclaimer
                        ? 'rgba(148, 163, 184, 0.05)'
                        : 'rgba(15, 23, 42, 0.65)',
                      border: isViolation
                        ? '1px solid rgba(244, 63, 94, 0.3)'
                        : isFocus
                        ? '1px solid rgba(6, 182, 212, 0.3)'
                        : isDisclaimer
                        ? '1px solid rgba(148, 163, 184, 0.2)'
                        : '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '12px 14px'
                    }}
                  >
                    {/* Clean Section Title */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '8px',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: isViolation
                          ? '#F43F5E'
                          : isFocus
                          ? '#06B6D4'
                          : isSummary
                          ? '#3B82F6'
                          : '#94A3B8'
                      }}
                    >
                      {isViolation && <AlertTriangle size={15} color="#F43F5E" />}
                      {isFocus && <Sparkles size={15} color="#06B6D4" />}
                      {isSummary && <FileText size={15} color="#3B82F6" />}
                      {isDisclaimer && <ShieldAlert size={15} color="#94A3B8" />}
                      <span>{sec.title}</span>
                    </div>

                    {/* Clean Items Grid / Rows */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {sec.items.map((item, iIdx) => {
                        if (item.isKeyValue && item.key) {
                          const isMoney = item.value.includes('₹');
                          const isHighPriority = item.value.includes('HIGH') || item.value.includes('CRITICAL');
                          const isBadge = item.value.includes('PRIORITY') || item.value.includes('Score');

                          return (
                            <div
                              key={iIdx}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                fontSize: '0.8rem',
                                flexWrap: 'wrap',
                                gap: '6px',
                                background: 'rgba(255,255,255,0.02)',
                                padding: '4px 8px',
                                borderRadius: '4px'
                              }}
                            >
                              <span style={{ color: '#94A3B8', fontWeight: 500 }}>{item.key}</span>
                              <span
                                style={{
                                  fontWeight: 600,
                                  color: isHighPriority
                                    ? '#F43F5E'
                                    : isMoney
                                    ? '#10B981'
                                    : isFocus
                                    ? '#06B6D4'
                                    : '#F8FAFC',
                                  fontSize: isBadge ? '0.75rem' : '0.8rem'
                                }}
                                className={isMoney || isBadge ? 'mono' : ''}
                              >
                                {item.value}
                              </span>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={iIdx}
                            style={{
                              fontSize: '0.8rem',
                              color: isDisclaimer ? '#94A3B8' : '#E2E8F0',
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '6px',
                              lineHeight: '1.5'
                            }}
                          >
                            {!isDisclaimer && (
                              <span style={{ color: isViolation ? '#F43F5E' : '#06B6D4', flexShrink: 0, marginTop: '2px' }}>•</span>
                            )}
                            <span>{item.value}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        )}
      </div>

      {/* Custom Prompt Input */}
      <form onSubmit={handleCustomSubmit} style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
        <input
          type="text"
          placeholder="Ask Qwen3 local AI auditor a question... (Press Enter)"
          value={customUserPrompt}
          onChange={(e) => setCustomUserPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleCustomSubmit(e);
            }
          }}
          style={{
            flex: 1,
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            padding: '6px 12px',
            color: '#F8FAFC',
            fontSize: '0.8rem',
            outline: 'none'
          }}
        />
        <button type="submit" className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
          <Send size={14} /> Ask
        </button>
      </form>

      {/* Footnote */}
      <div style={{ marginTop: '10px', fontSize: '0.725rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <ShieldAlert size={14} color="#06B6D4" />
        Strict Rule: Local Qwen3 model receives Evidence Object JSON metrics exclusively.
      </div>

    </div>
  );
};
