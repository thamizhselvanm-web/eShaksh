import { EvidenceObject, OverviewMetrics, AgencyProfileData } from '../types/mplads';

export const INITIAL_METRICS: OverviewMetrics = {
  totalExpenditure: 485000000, // ₹48.5 Cr
  totalWorks: 342,
  flaggedAnomaliesCount: 18,
  highPriorityCount: 5,
  mediumPriorityCount: 8,
  lowPriorityCount: 5,
  shellVendorsDetected: 4,
  groundTruthMismatchRate: 14.2, // %
  avgCostOverrunPct: 38.5, // %
};

export const MOCK_EVIDENCE_ITEMS: EvidenceObject[] = [
  // PLANTED CASE 1: Ghost Vendor Network
  {
    workId: "WRK-2026-901",
    workTitle: "Construction of Multi-purpose Community Hall - Sector 9",
    agencyId: "AGY-DRDA-JPR",
    agencyName: "District Rural Development Agency (DRDA) Jaipur",
    vendorName: "Apex Infra Developers Pvt Ltd",
    sanctionAmount: 4500000,
    claimedCompletionDate: "2026-07-15",
    anomalyScore: 88.5,
    priorityBand: "HIGH",
    dominantSignal: "VENDOR_NETWORK",
    isPlantedDemoCase: true,
    demoCaseTitle: "PLANTED CASE 1: The Ghost Vendor Network",
    demoCaseDescription: "Statistical baseline appears normal, but network graph reveals shell vendor rotation across 4 agencies sharing bank account prefix SBIN004928-1002*",
    signals: {
      historicalDev: 35,
      velocity: 40,
      peerDev: 30,
      concentration: 85,
      irregularity: 60,
      vendorRisk: 95, // Dominant
      groundTruthMismatch: 25,
      costRealismDev: 30
    },
    historicalBaselineMean: 4200000,
    zScore: 1.15,
    iqrDispersion: 450000,
    spendingVelocityIndex: 1.2,
    vendorGraphSummary: {
      nodes: [
        { id: "AGY-DRDA-JPR", type: "agency", canonicalName: "DRDA Jaipur", nameVariants: ["DRDA Jaipur", "DRDA District"], region: "Jaipur" },
        { id: "AGY-PWD-DIV3", type: "agency", canonicalName: "PWD Sub-Div 3", nameVariants: ["PWD Div 3", "Public Works D3"], region: "Jaipur" },
        { id: "AGY-ZILA-PAR", type: "agency", canonicalName: "Zila Parishad", nameVariants: ["Zila Parishad JPR"], region: "Jaipur Rural" },
        { id: "AGY-MUNI-CORP", type: "agency", canonicalName: "Municipal Corp North", nameVariants: ["JMC North"], region: "Jaipur City" },
        { id: "VND-APEX-INFRA", type: "vendor", canonicalName: "Apex Infra Developers", nameVariants: ["Apex Infra Dev Pvt Ltd", "Apex Infrastructure"], region: "Jaipur", riskFlag: "SHELL_COMPANY", accountPrefix: "SBIN004928-1002" },
        { id: "VND-SKYLINE", type: "vendor", canonicalName: "Skyline Trading Co", nameVariants: ["Skyline Contractors"], region: "Jaipur", riskFlag: "SHELL_COMPANY", accountPrefix: "SBIN004928-1002" },
        { id: "VND-VERTEX", type: "vendor", canonicalName: "Vertex Logistics", nameVariants: ["Vertex Suppliers"], region: "Jaipur", riskFlag: "SHELL_COMPANY", accountPrefix: "SBIN004928-1002" },
        { id: "ACC-SBIN-1002", type: "bank_account", canonicalName: "SBI Account Cluster *1002", nameVariants: ["SBIN004928-100244", "SBIN004928-100299"], region: "Jaipur Main Branch", riskFlag: "SHARED_ACCOUNT" }
      ],
      edges: [
        { id: "e1", source: "AGY-DRDA-JPR", target: "VND-APEX-INFRA", totalAmount: 4500000, txnCount: 3, sharedAccountPrefix: "SBIN004928-1002" },
        { id: "e2", source: "AGY-PWD-DIV3", target: "VND-SKYLINE", totalAmount: 3800000, txnCount: 2, sharedAccountPrefix: "SBIN004928-1002" },
        { id: "e3", source: "AGY-ZILA-PAR", target: "VND-VERTEX", totalAmount: 5200000, txnCount: 4, sharedAccountPrefix: "SBIN004928-1002" },
        { id: "e4", source: "AGY-MUNI-CORP", target: "VND-APEX-INFRA", totalAmount: 2900000, txnCount: 2, sharedAccountPrefix: "SBIN004928-1002" },
        { id: "e5", source: "VND-APEX-INFRA", target: "ACC-SBIN-1002", totalAmount: 7400000, txnCount: 5, sharedAccountPrefix: "SBIN004928-1002" },
        { id: "e6", source: "VND-SKYLINE", target: "ACC-SBIN-1002", totalAmount: 3800000, txnCount: 2, sharedAccountPrefix: "SBIN004928-1002" },
        { id: "e7", source: "VND-VERTEX", target: "ACC-SBIN-1002", totalAmount: 5200000, txnCount: 4, sharedAccountPrefix: "SBIN004928-1002" }
      ],
      shellIndicatorsCount: 3,
      rotationClusterCount: 1
    },
    groundTruth: {
      recordId: "GT-901",
      workId: "WRK-2026-901",
      photoBeforeUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=800&q=80",
      photoAfterUrl: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80",
      geotagLat: 26.9124,
      geotagLng: 75.7873,
      claimedLat: 26.9130,
      claimedLng: 75.7880,
      distanceDeltaKm: 0.12,
      exifTimestamp: "2026-07-14 14:22:10",
      claimedCompletionDate: "2026-07-15",
      locationMatchScore: 94,
      timestampMatchScore: 98,
      cvPresenceClass: "Community Hall Structure Present",
      confidenceScore: 92,
      status: "VERIFIED",
      fieldAttestation: {
        c2paSigned: true,
        c2paManifestId: "c2pa:urn:uuid:8f92a10b-4491-4c90-b901-d82e1401928a",
        signatureStatus: "VALID",
        hardwareKeyStore: "AndroidKeyStore (StrongBox)",
        deviceAttestation: "PASSED",
        attestationAuthority: "Google Play Integrity API v2",
        tsaTimestamp: "2026-07-14 14:22:10 UTC",
        tsaValid: true,
        tsaAuthority: "FreeTSA.org RFC 3161",
        traceValid: true,
        hashChainStatus: "INTACT",
        sampledPointsCount: 14,
        visitDurationMinutes: 18.5,
        traceHashHead: "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        teleportationJumpDetected: false,
        inspectorId: "INS-8842",
        inspectorName: "Rajesh Kumar (Junior Engineer)",
        assignmentPushedAt: "2026-07-14 08:30:00",
        assignmentGapMinutes: 352,
        isSuspiciouslyFast: false,
        claimedWeather: "Clear Sunny, 34°C",
        historicalApiWeather: "Clear Sunny, 33.8°C (OpenWeatherMap)",
        weatherMatch: true,
        attestationTrustScore: 92,
        trustFlags: ["HARDWARE_C2PA_SIGNED", "PLAY_INTEGRITY_PASSED", "TSA_TIME_VERIFIED", "GPS_TRACE_INTACT"]
      }
    },
    costRealism: {
      flagId: "CR-901",
      workId: "WRK-2026-901",
      workCategory: "Civil Construction - Community Hall",
      quantity: 450,
      unit: "sq.m",
      actualUnitCost: 10000,
      referenceUnitCost: 8800,
      deviationPct: 13.6,
      direction: "OVER",
      totalExcessCost: 540000,
      sorReference: {
        sorId: "SOR-PWD-2025-04",
        workCategory: "Civil Construction - Community Hall",
        unit: "sq.m",
        region: "Rajasthan PWD",
        year: 2025,
        referenceUnitCost: 8800,
        source: "Rajasthan PWD Schedule of Rates 2025-26"
      }
    },
    sourceRecords: [
      { txnId: "TXN-8801", date: "2026-03-10", agencyName: "DRDA Jaipur", vendorName: "Apex Infra Developers Pvt Ltd", workDescription: "Foundation advance release", amount: 1500000, sanctionOrderNo: "SO/DRDA/2026/102", bankAccountHash: "SBIN004928-100244" },
      { txnId: "TXN-8845", date: "2026-05-20", agencyName: "DRDA Jaipur", vendorName: "Apex Infra Developers Pvt Ltd", workDescription: "Roof slab completion milestone", amount: 1800000, sanctionOrderNo: "SO/DRDA/2026/184", bankAccountHash: "SBIN004928-100244" },
      { txnId: "TXN-8902", date: "2026-07-15", agencyName: "DRDA Jaipur", vendorName: "Apex Infra Developers Pvt Ltd", workDescription: "Final installment community hall", amount: 1200000, sanctionOrderNo: "SO/DRDA/2026/240", bankAccountHash: "SBIN004928-100244" }
    ]
  },

  // PLANTED CASE 2: Ground-Truth Geotag Mismatch (Phantom Road)
  {
    workId: "WRK-2026-902",
    workTitle: "Asphalt Road Construction - Gram Panchayat Link Road (km 0 to 4)",
    agencyId: "AGY-PWD-DIV3",
    agencyName: "PWD Sub-division 3, Jaipur",
    vendorName: "Vanguard Civil Works Ltd",
    sanctionAmount: 8400000,
    claimedCompletionDate: "2026-06-30",
    anomalyScore: 84.2,
    priorityBand: "HIGH",
    dominantSignal: "GROUND_TRUTH",
    isPlantedDemoCase: true,
    demoCaseTitle: "PLANTED CASE 2: Ground-Truth Mismatch (Phantom Road)",
    demoCaseDescription: "Claimed completion photo geotag is 4.8 km away in bare unpaved land; EXIF timestamp pre-dates sanction date by 3 months!",
    signals: {
      historicalDev: 20,
      velocity: 25,
      peerDev: 15,
      concentration: 30,
      irregularity: 70,
      vendorRisk: 35,
      groundTruthMismatch: 96, // Dominant
      costRealismDev: 40
    },
    historicalBaselineMean: 7900000,
    zScore: 0.63,
    iqrDispersion: 800000,
    spendingVelocityIndex: 1.05,
    vendorGraphSummary: {
      nodes: [
        { id: "AGY-PWD-DIV3", type: "agency", canonicalName: "PWD Sub-Div 3", nameVariants: ["PWD Div 3"], region: "Jaipur" },
        { id: "VND-VANGUARD", type: "vendor", canonicalName: "Vanguard Civil Works", nameVariants: ["Vanguard Civil Works Ltd"], region: "Jaipur", riskFlag: "NORMAL" }
      ],
      edges: [
        { id: "e-vg1", source: "AGY-PWD-DIV3", target: "VND-VANGUARD", totalAmount: 8400000, txnCount: 2 }
      ],
      shellIndicatorsCount: 0,
      rotationClusterCount: 0
    },
    groundTruth: {
      recordId: "GT-902",
      workId: "WRK-2026-902",
      photoBeforeUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
      photoAfterUrl: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=800&q=80",
      geotagLat: 26.8412,
      geotagLng: 75.8011,
      claimedLat: 26.8850,
      claimedLng: 75.8320,
      distanceDeltaKm: 4.85,
      exifTimestamp: "2025-11-04 09:15:00",
      claimedCompletionDate: "2026-06-30",
      locationMatchScore: 8, // Extreme mismatch
      timestampMatchScore: 12,
      cvPresenceClass: "Bare Unpaved Land / Zero Bitumen Detected",
      confidenceScore: 10,
      status: "MISMATCH",
      fieldAttestation: {
        c2paSigned: false,
        c2paManifestId: "c2pa:urn:uuid:INVALID-UNSIGNED-MANIFEST",
        signatureStatus: "INVALID",
        hardwareKeyStore: "Software Fallback",
        deviceAttestation: "FAILED",
        attestationAuthority: "Google Play Integrity (DEVICE_COMPROMISED_ROOTED)",
        tsaTimestamp: "2025-11-04 09:15:00 UTC",
        tsaValid: false,
        tsaAuthority: "Device Clock (TSA Server Unreachable / Spoofed)",
        traceValid: false,
        hashChainStatus: "DISCONTINUOUS",
        sampledPointsCount: 3,
        visitDurationMinutes: 1.2,
        traceHashHead: "sha256:CORRUPTED_HASH_CHAIN_JUMP_DETECTED",
        teleportationJumpDetected: true,
        inspectorId: "INS-4902",
        inspectorName: "Vikram Singh (Assistant Engineer)",
        assignmentPushedAt: "2026-06-30 09:10:00",
        assignmentGapMinutes: 5,
        isSuspiciouslyFast: true,
        claimedWeather: "Clear Sunny, 32°C",
        historicalApiWeather: "Heavy Rain & Monsoon Clouds, 22.4°C (OpenWeatherMap)",
        weatherMatch: false,
        attestationTrustScore: 18,
        trustFlags: [
          "C2PA_MANIFEST_INVALID",
          "PLAY_INTEGRITY_FAILED_ROOTED",
          "TSA_TIMESTAMP_FAILED",
          "GPS_TELEPORTATION_JUMP",
          "PRE_STAGED_ASSIGNMENT_GAP",
          "WEATHER_MISMATCH_SUNNY_VS_RAIN"
        ]
      }
    },
    costRealism: {
      flagId: "CR-902",
      workId: "WRK-2026-902",
      workCategory: "Road Construction - Bituminous Concrete",
      quantity: 4,
      unit: "km",
      actualUnitCost: 2100000,
      referenceUnitCost: 1850000,
      deviationPct: 13.5,
      direction: "OVER",
      totalExcessCost: 1000000,
      sorReference: {
        sorId: "SOR-PWD-2025-12",
        workCategory: "Road Construction - Bituminous Concrete",
        unit: "km",
        region: "Rajasthan PWD",
        year: 2025,
        referenceUnitCost: 1850000,
        source: "State Highway & Major District Road SOR 2025"
      }
    },
    sourceRecords: [
      { txnId: "TXN-9120", date: "2026-04-12", agencyName: "PWD Sub-division 3", vendorName: "Vanguard Civil Works Ltd", workDescription: "Earthwork & base course release", amount: 4200000, sanctionOrderNo: "SO/PWD/2026/088", bankAccountHash: "HDFC000192-882019" },
      { txnId: "TXN-9301", date: "2026-06-30", agencyName: "PWD Sub-division 3", vendorName: "Vanguard Civil Works Ltd", workDescription: "Final payment asphalt completion", amount: 4200000, sanctionOrderNo: "SO/PWD/2026/192", bankAccountHash: "HDFC000192-882019" }
    ]
  },

  // PLANTED CASE 3: Cost-Realism Manipulation (CPWD Rate Inflation)
  {
    workId: "WRK-2026-903",
    workTitle: "Installation of High-Mast Standalone Solar Street Lights (50 Units)",
    agencyId: "AGY-ZILA-PAR",
    agencyName: "Zila Parishad Jaipur Rural",
    vendorName: "Solaris Power Solutions Pvt Ltd",
    sanctionAmount: 2425000,
    claimedCompletionDate: "2026-08-01",
    anomalyScore: 81.4,
    priorityBand: "HIGH",
    dominantSignal: "COST_REALISM",
    isPlantedDemoCase: true,
    demoCaseTitle: "PLANTED CASE 3: CPWD Rate Manipulation (241% Unit Cost Deviation)",
    demoCaseDescription: "Agency history looks clean (Z-score 0.8), but solar lights unit cost is ₹48,500 vs CPWD Schedule of Rates benchmark ₹14,200",
    signals: {
      historicalDev: 15,
      velocity: 20,
      peerDev: 25,
      concentration: 30,
      irregularity: 20,
      vendorRisk: 40,
      groundTruthMismatch: 30,
      costRealismDev: 94 // Dominant
    },
    historicalBaselineMean: 2200000,
    zScore: 0.81,
    iqrDispersion: 250000,
    spendingVelocityIndex: 1.1,
    vendorGraphSummary: {
      nodes: [
        { id: "AGY-ZILA-PAR", type: "agency", canonicalName: "Zila Parishad", nameVariants: ["Zila Parishad Jaipur"], region: "Jaipur Rural" },
        { id: "VND-SOLARIS", type: "vendor", canonicalName: "Solaris Power Solutions", nameVariants: ["Solaris Power Pvt Ltd"], region: "Jaipur", riskFlag: "HIGH_CONCENTRATION" }
      ],
      edges: [
        { id: "e-sol1", source: "AGY-ZILA-PAR", target: "VND-SOLARIS", totalAmount: 2425000, txnCount: 1 }
      ],
      shellIndicatorsCount: 0,
      rotationClusterCount: 0
    },
    groundTruth: {
      recordId: "GT-903",
      workId: "WRK-2026-903",
      photoBeforeUrl: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80",
      photoAfterUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
      geotagLat: 26.9820,
      geotagLng: 75.8200,
      claimedLat: 26.9822,
      claimedLng: 75.8205,
      distanceDeltaKm: 0.05,
      exifTimestamp: "2026-07-31 17:10:00",
      claimedCompletionDate: "2026-08-01",
      locationMatchScore: 96,
      timestampMatchScore: 95,
      cvPresenceClass: "Solar Panel & LED Pole Installed",
      confidenceScore: 94,
      status: "VERIFIED",
      fieldAttestation: {
        c2paSigned: true,
        c2paManifestId: "c2pa:urn:uuid:3c91f092-9102-48a1-89b1-a901f482019c",
        signatureStatus: "VALID",
        hardwareKeyStore: "Apple Secure Enclave",
        deviceAttestation: "PASSED",
        attestationAuthority: "Apple App Attest Service",
        tsaTimestamp: "2026-07-31 17:10:00 UTC",
        tsaValid: true,
        tsaAuthority: "FreeTSA.org RFC 3161",
        traceValid: true,
        hashChainStatus: "INTACT",
        sampledPointsCount: 22,
        visitDurationMinutes: 24.0,
        traceHashHead: "sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
        teleportationJumpDetected: false,
        inspectorId: "INS-7719",
        inspectorName: "Pooja Sharma (Divisional Inspector)",
        assignmentPushedAt: "2026-07-31 14:00:00",
        assignmentGapMinutes: 190,
        isSuspiciouslyFast: false,
        claimedWeather: "Partly Cloudy, 30°C",
        historicalApiWeather: "Partly Cloudy, 29.5°C (OpenWeatherMap)",
        weatherMatch: true,
        attestationTrustScore: 96,
        trustFlags: ["HARDWARE_C2PA_SIGNED", "APP_ATTEST_PASSED", "TSA_TIME_VERIFIED", "GPS_TRACE_INTACT"]
      }
    },
    costRealism: {
      flagId: "CR-903",
      workId: "WRK-2026-903",
      workCategory: "Renewable Energy - Solar Street Light (120W LED + Lithium)",
      quantity: 50,
      unit: "Units",
      actualUnitCost: 48500,
      referenceUnitCost: 14200,
      deviationPct: 241.5, // Extreme overpricing
      direction: "OVER",
      totalExcessCost: 1715000,
      sorReference: {
        sorId: "SOR-CPWD-SOLAR-2025",
        workCategory: "Renewable Energy - Solar Street Light (120W LED + Lithium)",
        unit: "Units",
        region: "CPWD All-India Electrical Schedule 2025",
        year: 2025,
        referenceUnitCost: 14200,
        source: "CPWD Schedule of Rates Item 18.4.2"
      }
    },
    sourceRecords: [
      { txnId: "TXN-9502", date: "2026-08-01", agencyName: "Zila Parishad Jaipur Rural", vendorName: "Solaris Power Solutions Pvt Ltd", workDescription: "Supply & Erection of 50 Solar Lights", amount: 2425000, sanctionOrderNo: "SO/ZP/2026/301", bankAccountHash: "ICIC000041-993021" }
    ]
  },

  // CASE 4: High Velocity + Peer Deviation
  {
    workId: "WRK-2026-904",
    workTitle: "Deep Borewell Drilling & Handpump Installation in 12 Villages",
    agencyId: "AGY-DRDA-JPR",
    agencyName: "District Rural Development Agency (DRDA) Jaipur",
    vendorName: "Marudhar Water Systems",
    sanctionAmount: 3600000,
    claimedCompletionDate: "2026-05-10",
    anomalyScore: 78.0,
    priorityBand: "MEDIUM",
    dominantSignal: "STATISTICAL",
    signals: {
      historicalDev: 75,
      velocity: 88,
      peerDev: 80,
      concentration: 40,
      irregularity: 65,
      vendorRisk: 30,
      groundTruthMismatch: 45,
      costRealismDev: 25
    },
    historicalBaselineMean: 1800000,
    zScore: 2.85,
    iqrDispersion: 320000,
    spendingVelocityIndex: 3.4,
    vendorGraphSummary: {
      nodes: [
        { id: "AGY-DRDA-JPR", type: "agency", canonicalName: "DRDA Jaipur", nameVariants: ["DRDA Jaipur"], region: "Jaipur" },
        { id: "VND-MARUDHAR", type: "vendor", canonicalName: "Marudhar Water Systems", nameVariants: ["Marudhar Water"], region: "Jaipur", riskFlag: "NORMAL" }
      ],
      edges: [
        { id: "e-m1", source: "AGY-DRDA-JPR", target: "VND-MARUDHAR", totalAmount: 3600000, txnCount: 4 }
      ],
      shellIndicatorsCount: 0,
      rotationClusterCount: 0
    },
    groundTruth: {
      recordId: "GT-904",
      workId: "WRK-2026-904",
      photoBeforeUrl: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80",
      photoAfterUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80",
      geotagLat: 26.8900,
      geotagLng: 75.7500,
      claimedLat: 26.8910,
      claimedLng: 75.7520,
      distanceDeltaKm: 0.22,
      exifTimestamp: "2026-05-09 11:30:00",
      claimedCompletionDate: "2026-05-10",
      locationMatchScore: 88,
      timestampMatchScore: 92,
      cvPresenceClass: "Handpump Rig Assembly Present",
      confidenceScore: 85,
      status: "VERIFIED"
    },
    costRealism: {
      flagId: "CR-904",
      workId: "WRK-2026-904",
      workCategory: "Water Supply - Borewell & Handpump",
      quantity: 12,
      unit: "Units",
      actualUnitCost: 300000,
      referenceUnitCost: 240000,
      deviationPct: 25.0,
      direction: "OVER",
      totalExcessCost: 720000,
      sorReference: {
        sorId: "SOR-PHED-2025",
        workCategory: "Water Supply - Borewell & Handpump",
        unit: "Units",
        region: "Rajasthan PHED",
        year: 2025,
        referenceUnitCost: 240000,
        source: "PHED Schedule of Rates 2025"
      }
    },
    sourceRecords: [
      { txnId: "TXN-7701", date: "2026-05-01", agencyName: "DRDA Jaipur", vendorName: "Marudhar Water Systems", workDescription: "Rig deployment 1", amount: 900000, sanctionOrderNo: "SO/DRDA/088", bankAccountHash: "BARB0JAIPUR-001" },
      { txnId: "TXN-7702", date: "2026-05-04", agencyName: "DRDA Jaipur", vendorName: "Marudhar Water Systems", workDescription: "Rig deployment 2", amount: 900000, sanctionOrderNo: "SO/DRDA/089", bankAccountHash: "BARB0JAIPUR-001" },
      { txnId: "TXN-7703", date: "2026-05-08", agencyName: "DRDA Jaipur", vendorName: "Marudhar Water Systems", workDescription: "Rig deployment 3", amount: 900000, sanctionOrderNo: "SO/DRDA/090", bankAccountHash: "BARB0JAIPUR-001" },
      { txnId: "TXN-7704", date: "2026-05-10", agencyName: "DRDA Jaipur", vendorName: "Marudhar Water Systems", workDescription: "Final clearance", amount: 900000, sanctionOrderNo: "SO/DRDA/091", bankAccountHash: "BARB0JAIPUR-001" }
    ]
  },

  // CASE 5: Unverifiable Ground Truth (Missing Photo Data Fallback)
  {
    workId: "WRK-2026-905",
    workTitle: "Supply of Computer Systems to Government Senior Secondary School",
    agencyId: "AGY-MUNI-CORP",
    agencyName: "Municipal Corporation Jaipur North",
    vendorName: "Infotech Systems & Solutions",
    sanctionAmount: 1800000,
    claimedCompletionDate: "2026-06-15",
    anomalyScore: 48.5,
    priorityBand: "LOW",
    dominantSignal: "STATISTICAL",
    signals: {
      historicalDev: 25,
      velocity: 30,
      peerDev: 20,
      concentration: 15,
      irregularity: 10,
      vendorRisk: 15,
      groundTruthMismatch: 50, // Unverifiable neutral fallback
      costRealismDev: 12
    },
    historicalBaselineMean: 1750000,
    zScore: 0.25,
    iqrDispersion: 180000,
    spendingVelocityIndex: 0.95,
    vendorGraphSummary: {
      nodes: [
        { id: "AGY-MUNI-CORP", type: "agency", canonicalName: "Municipal Corp North", nameVariants: ["JMC North"], region: "Jaipur City" },
        { id: "VND-INFOTECH", type: "vendor", canonicalName: "Infotech Systems", nameVariants: ["Infotech Systems & Solutions"], region: "Jaipur", riskFlag: "NORMAL" }
      ],
      edges: [
        { id: "e-info1", source: "AGY-MUNI-CORP", target: "VND-INFOTECH", totalAmount: 1800000, txnCount: 1 }
      ],
      shellIndicatorsCount: 0,
      rotationClusterCount: 0
    },
    groundTruth: {
      recordId: "GT-905",
      workId: "WRK-2026-905",
      photoBeforeUrl: "",
      photoAfterUrl: "",
      geotagLat: 0,
      geotagLng: 0,
      claimedLat: 26.9200,
      claimedLng: 75.8100,
      distanceDeltaKm: 0,
      exifTimestamp: "N/A",
      claimedCompletionDate: "2026-06-15",
      locationMatchScore: 50,
      timestampMatchScore: 50,
      cvPresenceClass: "No Geotagged Media Provided",
      confidenceScore: null, // Unverifiable state handling
      status: "UNVERIFIABLE",
      unverifiableReason: "eSAKSHI portal indicates asset procurement exempted from mandatory stage photo upload. Degraded to neutral score."
    },
    costRealism: {
      flagId: "CR-905",
      workId: "WRK-2026-905",
      workCategory: "IT Equipment - Desktop Computers (Intel i5/16GB)",
      quantity: 30,
      unit: "Units",
      actualUnitCost: 60000,
      referenceUnitCost: 58000,
      deviationPct: 3.4,
      direction: "NORMAL",
      totalExcessCost: 60000,
      sorReference: {
        sorId: "SOR-GEM-2025",
        workCategory: "IT Equipment - Desktop Computers",
        unit: "Units",
        region: "GeM Government Portal Rate",
        year: 2025,
        referenceUnitCost: 58000,
        source: "GeM Rate Contract Q2 2025"
      }
    },
    sourceRecords: [
      { txnId: "TXN-6610", date: "2026-06-15", agencyName: "Municipal Corporation Jaipur North", vendorName: "Infotech Systems & Solutions", workDescription: "Supply of 30 Desktop PCs", amount: 1800000, sanctionOrderNo: "SO/JMC/2026/044", bankAccountHash: "CNRB000219-4091" }
    ]
  }
];

export const MOCK_AGENCIES: AgencyProfileData[] = [
  {
    agencyId: "AGY-DRDA-JPR",
    name: "District Rural Development Agency (DRDA) Jaipur",
    region: "Jaipur Rural",
    totalAllocation: 180000000,
    totalExpended: 142000000,
    workCount: 98,
    flaggedWorkCount: 6,
    vendorDensityIndex: 0.78, // High vendor concentration
    groundTruthComplianceRate: 82.5,
    spendingVelocityHistory: [
      { month: "Jan", amount: 8000000, baseline: 10000000 },
      { month: "Feb", amount: 9500000, baseline: 10000000 },
      { month: "Mar", amount: 28000000, baseline: 12000000 }, // March rush
      { month: "Apr", amount: 6000000, baseline: 8000000 },
      { month: "May", amount: 14000000, baseline: 9000000 },
      { month: "Jun", amount: 12000000, baseline: 9000000 }
    ]
  },
  {
    agencyId: "AGY-PWD-DIV3",
    name: "PWD Sub-division 3, Jaipur",
    region: "Jaipur Central",
    totalAllocation: 210000000,
    totalExpended: 185000000,
    workCount: 124,
    flaggedWorkCount: 7,
    vendorDensityIndex: 0.42,
    groundTruthComplianceRate: 64.0, // Low GT compliance
    spendingVelocityHistory: [
      { month: "Jan", amount: 15000000, baseline: 15000000 },
      { month: "Feb", amount: 16000000, baseline: 15000000 },
      { month: "Mar", amount: 32000000, baseline: 18000000 },
      { month: "Apr", amount: 11000000, baseline: 12000000 },
      { month: "May", amount: 18000000, baseline: 14000000 },
      { month: "Jun", amount: 22000000, baseline: 15000000 }
    ]
  },
  {
    agencyId: "AGY-ZILA-PAR",
    name: "Zila Parishad Jaipur Rural",
    region: "Jaipur Outskirts",
    totalAllocation: 95000000,
    totalExpended: 78000000,
    workCount: 65,
    flaggedWorkCount: 3,
    vendorDensityIndex: 0.65,
    groundTruthComplianceRate: 91.2,
    spendingVelocityHistory: [
      { month: "Jan", amount: 5000000, baseline: 6000000 },
      { month: "Feb", amount: 6500000, baseline: 6000000 },
      { month: "Mar", amount: 14000000, baseline: 8000000 },
      { month: "Apr", amount: 4500000, baseline: 5000000 },
      { month: "May", amount: 7000000, baseline: 6000000 },
      { month: "Jun", amount: 8500000, baseline: 6500000 }
    ]
  }
];
