// ========================================
// Sample Industrial Documents Database
// ========================================

export const documents = [
  {
    id: 'DOC-001',
    name: 'P&ID - Crude Distillation Unit CDU-1',
    type: 'pid',
    format: 'dwg',
    category: 'Engineering Drawing',
    plant: 'IOCL Gujarat Refinery',
    unit: 'CDU-1',
    uploadDate: '2024-11-15',
    size: '4.2 MB',
    status: 'processed',
    entities: {
      equipment: ['CDU-1', 'E-101', 'E-102', 'P-101A/B', 'V-101', 'T-101'],
      parameters: ['350°C', '2.5 kg/cm²', 'Flow: 450 m³/hr'],
      regulations: ['OISD-STD-118', 'IS 2825'],
      personnel: ['R. Sharma (Lead Engineer)']
    },
    confidence: 94
  },
  {
    id: 'DOC-002',
    name: 'Maintenance WO - Heat Exchanger E-101 Tube Bundle',
    type: 'workorder',
    format: 'pdf',
    category: 'Maintenance Record',
    plant: 'IOCL Gujarat Refinery',
    unit: 'CDU-1',
    uploadDate: '2025-01-08',
    size: '1.1 MB',
    status: 'processed',
    entities: {
      equipment: ['E-101', 'CDU-1'],
      parameters: ['MTBF: 8760 hrs', 'Tube wall: 2.1mm'],
      regulations: ['API 660', 'ASME Sec VIII'],
      personnel: ['K. Patel (Maintenance Supervisor)', 'D. Singh (Technician)']
    },
    confidence: 91
  },
  {
    id: 'DOC-003',
    name: 'SOP - Emergency Shutdown Procedure CDU-1',
    type: 'sop',
    format: 'pdf',
    category: 'Operating Procedure',
    plant: 'IOCL Gujarat Refinery',
    unit: 'CDU-1',
    uploadDate: '2024-09-20',
    size: '2.3 MB',
    status: 'processed',
    entities: {
      equipment: ['CDU-1', 'XV-101', 'XV-102', 'PSV-101', 'FCV-101'],
      parameters: ['Max temp: 400°C', 'Trip pressure: 3.5 kg/cm²'],
      regulations: ['OISD-STD-105', 'Factory Act 1948 Sec 41-B'],
      personnel: ['S. Kumar (Shift Supervisor)', 'A. Mishra (Safety Officer)']
    },
    confidence: 97
  },
  {
    id: 'DOC-004',
    name: 'Inspection Report - Boiler B-201 Annual Survey',
    type: 'inspection',
    format: 'pdf',
    category: 'Inspection Report',
    plant: 'NTPC Vindhyachal',
    unit: 'Unit-3',
    uploadDate: '2025-02-14',
    size: '5.7 MB',
    status: 'processed',
    entities: {
      equipment: ['B-201', 'SH-201', 'ECO-201', 'APH-201'],
      parameters: ['Steam: 540°C/170 kg/cm²', 'Efficiency: 86.4%'],
      regulations: ['IBR 1950', 'IS 2825', 'ASME Sec I'],
      personnel: ['M. Gupta (IBR Inspector)', 'V. Reddy (Plant Manager)']
    },
    confidence: 89
  },
  {
    id: 'DOC-005',
    name: 'Quality NCR - Weld Defect Report BF-3 Shell',
    type: 'ncr',
    format: 'pdf',
    category: 'Quality Record',
    plant: 'Tata Steel Jamshedpur',
    unit: 'BF-3',
    uploadDate: '2025-03-02',
    size: '890 KB',
    status: 'processed',
    entities: {
      equipment: ['BF-3', 'Shell-Ring-4', 'TW-3'],
      parameters: ['Porosity: 2.3%', 'Acceptance: <1.5%', 'UT reading: 8.2mm'],
      regulations: ['IS 2062', 'AWS D1.1', 'ISO 5817-C'],
      personnel: ['P. Jha (QC Inspector)', 'N. Verma (Welding Engineer)']
    },
    confidence: 96
  },
  {
    id: 'DOC-006',
    name: 'Environmental Compliance - Stack Emission Report Q3',
    type: 'compliance',
    format: 'xlsx',
    category: 'Regulatory Filing',
    plant: 'IOCL Gujarat Refinery',
    unit: 'FCC Unit',
    uploadDate: '2025-01-20',
    size: '340 KB',
    status: 'processed',
    entities: {
      equipment: ['FCC-1', 'Stack-3', 'ESP-301'],
      parameters: ['SOx: 42 mg/Nm³', 'NOx: 78 mg/Nm³', 'PM: 28 mg/Nm³'],
      regulations: ['CPCB Standards', 'EP Act 1986', 'GPCB Consent'],
      personnel: ['R. Iyer (Env. Officer)']
    },
    confidence: 88
  },
  {
    id: 'DOC-007',
    name: 'OEM Manual - Centrifugal Compressor K-301',
    type: 'manual',
    format: 'pdf',
    category: 'OEM Documentation',
    plant: 'IOCL Gujarat Refinery',
    unit: 'HCU',
    uploadDate: '2024-06-12',
    size: '18.5 MB',
    status: 'processed',
    entities: {
      equipment: ['K-301', 'K-301-DRV', 'LO-301', 'DGS-301'],
      parameters: ['Speed: 11,500 RPM', 'Power: 4500 kW', 'Flow: 12,000 m³/hr'],
      regulations: ['API 617', 'API 614'],
      personnel: ['Dresser-Rand (OEM)']
    },
    confidence: 93
  },
  {
    id: 'DOC-008',
    name: 'Incident Report - Minor Fire at Tank Farm TK-15',
    type: 'incident',
    format: 'pdf',
    category: 'Safety Record',
    plant: 'IOCL Gujarat Refinery',
    unit: 'Tank Farm',
    uploadDate: '2024-08-30',
    size: '3.2 MB',
    status: 'processed',
    entities: {
      equipment: ['TK-15', 'FF-System-2', 'FW-Pump-3'],
      parameters: ['Duration: 45 min', 'Area: 12 m²', 'Response: 4 min'],
      regulations: ['OISD-STD-116', 'OISD-STD-117', 'PESO Rules'],
      personnel: ['S. Kumar (Safety Officer)', 'Fire Team Alpha']
    },
    confidence: 95
  },
  {
    id: 'DOC-009',
    name: 'Turnaround Plan - CDU-1 Planned Shutdown 2025',
    type: 'project',
    format: 'xlsx',
    category: 'Project File',
    plant: 'IOCL Gujarat Refinery',
    unit: 'CDU-1',
    uploadDate: '2025-04-01',
    size: '2.8 MB',
    status: 'processed',
    entities: {
      equipment: ['CDU-1', 'E-101', 'E-102', 'E-103', 'T-101', 'P-101A/B', 'V-101'],
      parameters: ['Duration: 28 days', 'Budget: ₹45 Cr', 'Man-hours: 125,000'],
      regulations: ['OISD-GDN-206'],
      personnel: ['A. Deshmukh (TA Manager)', 'R. Sharma (Lead Engineer)']
    },
    confidence: 90
  },
  {
    id: 'DOC-010',
    name: 'Vibration Analysis Report - Turbine GT-101',
    type: 'inspection',
    format: 'pdf',
    category: 'Condition Monitoring',
    plant: 'NTPC Vindhyachal',
    unit: 'Unit-1',
    uploadDate: '2025-03-18',
    size: '6.1 MB',
    status: 'processed',
    entities: {
      equipment: ['GT-101', 'GEN-101', 'GB-101'],
      parameters: ['1X: 2.8 mm/s', '2X: 1.2 mm/s', 'Bearing Temp: 82°C'],
      regulations: ['ISO 10816', 'API 616'],
      personnel: ['V. Krishnan (CBM Engineer)']
    },
    confidence: 92
  },
  {
    id: 'DOC-011',
    name: 'HAZOP Study - New LPG Bottling Unit',
    type: 'safety',
    format: 'pdf',
    category: 'Safety Study',
    plant: 'IOCL Gujarat Refinery',
    unit: 'LPG Bottling',
    uploadDate: '2024-12-05',
    size: '8.9 MB',
    status: 'processed',
    entities: {
      equipment: ['LPG-Fill-01 to 08', 'V-401', 'P-401A/B', 'PSV-401 to 408'],
      parameters: ['LPG Pressure: 7 kg/cm²', 'Fill Rate: 20 kg/min'],
      regulations: ['OISD-STD-144', 'PESO', 'Gas Cylinder Rules 2004'],
      personnel: ['HAZOP Team Lead: Dr. S. Menon']
    },
    confidence: 94
  },
  {
    id: 'DOC-012',
    name: 'Corrosion Monitoring Report - Pipeline PL-205',
    type: 'inspection',
    format: 'pdf',
    category: 'Inspection Report',
    plant: 'IOCL Gujarat Refinery',
    unit: 'Pipelines',
    uploadDate: '2025-02-28',
    size: '1.8 MB',
    status: 'processed',
    entities: {
      equipment: ['PL-205', 'CP-Station-3', 'TLP-205-1 to 12'],
      parameters: ['Min. wall: 4.8mm', 'Corrosion rate: 0.12 mm/yr', 'CP: -950 mV'],
      regulations: ['OISD-STD-141', 'NACE SP0169', 'API 570'],
      personnel: ['J. Mehta (Corrosion Engineer)']
    },
    confidence: 91
  },
  {
    id: 'DOC-013',
    name: 'Training Record - Operator Competency Assessment',
    type: 'training',
    format: 'xlsx',
    category: 'HR Record',
    plant: 'NTPC Vindhyachal',
    unit: 'Training Center',
    uploadDate: '2025-01-30',
    size: '520 KB',
    status: 'processed',
    entities: {
      equipment: [],
      parameters: ['Pass rate: 87%', 'Avg score: 78/100'],
      regulations: ['Factory Act 1948 Sec 41-C', 'NTPC Training Policy'],
      personnel: ['15 Operators', 'H. Das (Training Manager)']
    },
    confidence: 85
  },
  {
    id: 'DOC-014',
    name: 'RBI Assessment - Pressure Vessels Area-1',
    type: 'inspection',
    format: 'pdf',
    category: 'Risk Assessment',
    plant: 'IOCL Gujarat Refinery',
    unit: 'CDU-1',
    uploadDate: '2025-04-10',
    size: '4.5 MB',
    status: 'processing',
    entities: {
      equipment: ['V-101', 'V-102', 'V-103', 'D-101'],
      parameters: ['Risk: Medium-High', 'Next inspection: 2026-Q2'],
      regulations: ['API 580/581', 'ASME PCC-3'],
      personnel: ['R. Sharma (Lead Engineer)', 'External: Bureau Veritas']
    },
    confidence: 87
  },
  {
    id: 'DOC-015',
    name: 'MOC - Change Request for DCS Upgrade CDU-1',
    type: 'moc',
    format: 'pdf',
    category: 'Change Management',
    plant: 'IOCL Gujarat Refinery',
    unit: 'CDU-1',
    uploadDate: '2025-03-25',
    size: '1.5 MB',
    status: 'processed',
    entities: {
      equipment: ['DCS-CDU1', 'PLC-101', 'HMI-CDU1'],
      parameters: ['System: Honeywell Experion to Yokogawa CS3000'],
      regulations: ['OISD-STD-105', 'IEC 61511'],
      personnel: ['A. Deshmukh (TA Manager)', 'I&C Team']
    },
    confidence: 93
  }
];

export const documentTypes = [
  { type: 'pid', label: 'P&ID / Drawing', icon: '📐', color: 'var(--primary-400)' },
  { type: 'workorder', label: 'Work Order', icon: '🔧', color: 'var(--warning-400)' },
  { type: 'sop', label: 'SOP / Procedure', icon: '📋', color: 'var(--success-400)' },
  { type: 'inspection', label: 'Inspection Report', icon: '🔍', color: 'var(--cyan-400)' },
  { type: 'ncr', label: 'Quality NCR', icon: '⚠️', color: 'var(--danger-400)' },
  { type: 'compliance', label: 'Regulatory Filing', icon: '📜', color: 'var(--purple-400)' },
  { type: 'manual', label: 'OEM Manual', icon: '📖', color: 'var(--orange-400)' },
  { type: 'incident', label: 'Incident Report', icon: '🚨', color: 'var(--danger-400)' },
  { type: 'project', label: 'Project File', icon: '📊', color: 'var(--primary-400)' },
  { type: 'safety', label: 'Safety Study', icon: '🛡️', color: 'var(--warning-400)' },
  { type: 'moc', label: 'MOC Record', icon: '🔄', color: 'var(--success-400)' },
  { type: 'training', label: 'Training Record', icon: '🎓', color: 'var(--purple-400)' }
];

export const supportedFormats = ['PDF', 'DWG', 'DXF', 'XLSX', 'DOCX', 'JPG/PNG', 'TIFF', 'CSV', 'EML'];

export const processingPipeline = [
  { step: 1, name: 'Document Intake', desc: 'Format detection, OCR for scanned documents', icon: '📥' },
  { step: 2, name: 'Text Extraction', desc: 'NLP-powered text and structure extraction', icon: '📄' },
  { step: 3, name: 'Entity Recognition', desc: 'Equipment tags, parameters, regulations, personnel', icon: '🏷️' },
  { step: 4, name: 'Classification', desc: 'Document type and category classification', icon: '📂' },
  { step: 5, name: 'Relationship Mapping', desc: 'Cross-document entity linking and deduplication', icon: '🔗' },
  { step: 6, name: 'Knowledge Graph', desc: 'Graph integration and vector embedding generation', icon: '🕸️' }
];
