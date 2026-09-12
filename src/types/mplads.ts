export type PriorityBand = 'HIGH' | 'MEDIUM' | 'LOW';

export type DominantSignal = 'VENDOR_NETWORK' | 'GROUND_TRUTH' | 'COST_REALISM' | 'STATISTICAL';

export interface SignalBreakdown {
  historicalDev: number;   // weight 15%
  velocity: number;        // weight 15%
  peerDev: number;         // weight 10%
  concentration: number;   // weight 5%
  irregularity: number;    // weight 5%
  vendorRisk: number;      // weight 20%
  groundTruthMismatch: number; // weight 20%
  costRealismDev: number;  // weight 10%
}

export interface VendorNode {
  id: string;
  type: 'agency' | 'vendor' | 'bank_account';
  canonicalName: string;
  nameVariants: string[];
  region: string;
  riskFlag?: 'SHELL_COMPANY' | 'SHARED_ACCOUNT' | 'HIGH_CONCENTRATION' | 'NORMAL';
  accountPrefix?: string;
}

export interface VendorEdge {
  id: string;
  source: string;
  target: string;
  totalAmount: number;
  txnCount: number;
  isClustered?: boolean;
  sharedAccountPrefix?: string;
}

export interface SubgraphData {
  nodes: VendorNode[];
  edges: VendorEdge[];
  shellIndicatorsCount: number;
  rotationClusterCount: number;
}

export interface FieldAttestationRecord {
  // C2PA Hardware Manifest & Provenance
  c2paSigned: boolean;
  c2paManifestId: string;
  signatureStatus: 'VALID' | 'INVALID' | 'MISSING';
  hardwareKeyStore: 'AndroidKeyStore (StrongBox)' | 'Apple Secure Enclave' | 'Software Fallback';
  deviceAttestation: 'PASSED' | 'FAILED' | 'BYPASSED';
  attestationAuthority: string;
  
  // RFC 3161 Time-Stamping Authority (TSA)
  tsaTimestamp: string;
  tsaValid: boolean;
  tsaAuthority: string;
  
  // Continuous GPS Hash-Chain Trace
  traceValid: boolean;
  hashChainStatus: 'INTACT' | 'DISCONTINUOUS' | 'STATIONARY_MOCKED';
  sampledPointsCount: number;
  visitDurationMinutes: number;
  traceHashHead: string;
  teleportationJumpDetected: boolean;
  
  // Random Assignment Module
  inspectorId: string;
  inspectorName: string;
  assignmentPushedAt: string;
  assignmentGapMinutes: number;
  isSuspiciouslyFast: boolean;
  
  // Environmental & Weather Cross-Check
  claimedWeather: string;
  historicalApiWeather: string;
  weatherMatch: boolean;
  
  // Captured Media & DB Details
  mediaType?: 'photo' | 'video';
  mediaUrl?: string;
  videoDurationSec?: number;
  mediaHashSha256?: string;
  dbRecordId?: string;
  capturedGeotagLat?: number;
  capturedGeotagLng?: number;
  capturedTimestamp?: string;

  // Overall Attestation Trust Score
  attestationTrustScore: number; // 0 - 100
  trustFlags: string[];
}

export interface GroundTruthRecord {
  recordId: string;
  workId: string;
  photoBeforeUrl: string;
  photoAfterUrl: string;
  geotagLat: number;
  geotagLng: number;
  claimedLat: number;
  claimedLng: number;
  distanceDeltaKm: number;
  exifTimestamp: string;
  claimedCompletionDate: string;
  locationMatchScore: number; // 0-100
  timestampMatchScore: number; // 0-100
  cvPresenceClass: string; // e.g. "Bare Land / No Asphalt Found" vs "Road Structure Present"
  confidenceScore: number | null; // Nullable for unverifiable
  status: 'VERIFIED' | 'MISMATCH' | 'UNVERIFIABLE';
  unverifiableReason?: string;
  fieldAttestation?: FieldAttestationRecord;
}

export interface SORReference {
  sorId: string;
  workCategory: string;
  unit: string;
  region: string;
  year: number;
  referenceUnitCost: number;
  source: string;
}

export interface CostRealismFlag {
  flagId: string;
  workId: string;
  workCategory: string;
  quantity: number;
  unit: string;
  actualUnitCost: number;
  referenceUnitCost: number;
  deviationPct: number;
  direction: 'OVER' | 'UNDER' | 'NORMAL';
  totalExcessCost: number;
  sorReference: SORReference;
}

export interface SourceRecord {
  txnId: string;
  date: string;
  agencyName: string;
  vendorName: string;
  workDescription: string;
  amount: number;
  sanctionOrderNo: string;
  bankAccountHash: string;
}

export interface EvidenceObject {
  workId: string;
  workTitle: string;
  agencyId: string;
  agencyName: string;
  vendorName: string;
  sanctionAmount: number;
  claimedCompletionDate: string;
  
  // Scoring
  anomalyScore: number;
  priorityBand: PriorityBand;
  dominantSignal: DominantSignal;
  signals: SignalBreakdown;
  
  // Core Signals Evidence
  vendorGraphSummary: SubgraphData;
  groundTruth: GroundTruthRecord;
  costRealism: CostRealismFlag;
  
  // Statistical Baseline
  historicalBaselineMean: number;
  zScore: number;
  iqrDispersion: number;
  spendingVelocityIndex: number;
  
  // Raw Source Records
  sourceRecords: SourceRecord[];
  
  // Planted Case Marker for SIH Demo
  isPlantedDemoCase?: boolean;
  demoCaseTitle?: string;
  demoCaseDescription?: string;
}

export interface AgencyProfileData {
  agencyId: string;
  name: string;
  region: string;
  totalAllocation: number;
  totalExpended: number;
  workCount: number;
  flaggedWorkCount: number;
  vendorDensityIndex: number;
  groundTruthComplianceRate: number;
  spendingVelocityHistory: { month: string; amount: number; baseline: number }[];
}

export interface OverviewMetrics {
  totalExpenditure: number;
  totalWorks: number;
  flaggedAnomaliesCount: number;
  highPriorityCount: number;
  mediumPriorityCount: number;
  lowPriorityCount: number;
  shellVendorsDetected: number;
  groundTruthMismatchRate: number;
  avgCostOverrunPct: number;
}
