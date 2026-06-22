// ========================================
// Quality & Compliance Data
// ========================================

export const complianceFrameworks = [
  { id: 'factory-act', name: 'Factory Act 1948', authority: 'DGFASLI', score: 91, total: 42, compliant: 38, gaps: 4, icon: '🏭', desc: 'Worker safety, hazardous processes, welfare' },
  { id: 'oisd', name: 'OISD Standards', authority: 'OISD/MoPNG', score: 87, total: 68, compliant: 59, gaps: 9, icon: '🛢️', desc: 'Oil industry safety & design standards' },
  { id: 'peso', name: 'PESO Regulations', authority: 'PESO', score: 94, total: 31, compliant: 29, gaps: 2, icon: '⚡', desc: 'Petroleum & explosives safety' },
  { id: 'ibr', name: 'IBR 1950', authority: 'Chief Inspector', score: 96, total: 22, compliant: 21, gaps: 1, icon: '🔥', desc: 'Indian Boiler Regulations' },
  { id: 'cpcb', name: 'CPCB/SPCB Norms', authority: 'CPCB', score: 82, total: 36, compliant: 29, gaps: 7, icon: '🌿', desc: 'Environmental emission & discharge limits' },
  { id: 'iso-9001', name: 'ISO 9001:2015', authority: 'ISO', score: 93, total: 52, compliant: 48, gaps: 4, icon: '✅', desc: 'Quality Management System' },
  { id: 'iso-14001', name: 'ISO 14001:2015', authority: 'ISO', score: 88, total: 38, compliant: 33, gaps: 5, icon: '♻️', desc: 'Environmental Management System' },
  { id: 'iso-45001', name: 'ISO 45001:2018', authority: 'ISO', score: 90, total: 44, compliant: 40, gaps: 4, icon: '🛡️', desc: 'OH&S Management System' }
];

export const complianceGaps = [
  {
    id: 'GAP-001', severity: 'critical',
    framework: 'OISD', requirement: 'OISD-STD-116 Cl. 5.3',
    title: 'Fire water storage capacity below minimum',
    desc: 'Tank farm fire water reserve at 78% of OISD requirement following TK-15 incident. FW Tank-2 bottom plate repair pending.',
    area: 'Tank Farm', dueDate: '2025-06-30',
    impact: 'Non-compliance may affect refinery operating license renewal'
  },
  {
    id: 'GAP-002', severity: 'critical',
    framework: 'CPCB', requirement: 'EP Act Schedule VI',
    title: 'SOx emissions exceeding revised CPCB norms',
    desc: 'FCC regenerator SOx at 42 mg/Nm³ vs revised limit of 30 mg/Nm³ effective Jan 2025. FGD installation in progress.',
    area: 'FCC Unit', dueDate: '2025-09-30',
    impact: 'Potential show-cause notice from GPCB'
  },
  {
    id: 'GAP-003', severity: 'major',
    framework: 'Factory Act', requirement: 'Section 41-B(4)',
    title: 'Safety audit overdue for LPG Bottling Unit',
    desc: 'Biennial safety audit was due March 2025. New HAZOP completed but external audit not yet scheduled.',
    area: 'LPG Bottling', dueDate: '2025-05-31',
    impact: 'Regulatory inspection risk'
  },
  {
    id: 'GAP-004', severity: 'major',
    framework: 'OISD', requirement: 'OISD-STD-105 Cl. 8',
    title: 'SIL verification not completed for CDU-1 DCS upgrade',
    desc: 'MOC for DCS migration approved but SIL verification for 12 safety loops pending. Cannot commission without SIL signoff.',
    area: 'CDU-1', dueDate: '2025-07-15',
    impact: 'Blocks DCS commissioning timeline'
  },
  {
    id: 'GAP-005', severity: 'minor',
    framework: 'ISO 9001', requirement: 'Clause 8.5.2',
    title: 'Traceability records incomplete for imported spares',
    desc: '3 heat exchangers tube bundles procured from China lack full material test certificates. MTR verification in progress.',
    area: 'Procurement', dueDate: '2025-06-15',
    impact: 'Quality audit observation'
  },
  {
    id: 'GAP-006', severity: 'major',
    framework: 'CPCB', requirement: 'HW Rules 2016',
    title: 'Hazardous waste manifest discrepancy',
    desc: 'Spent catalyst disposal records show 2.3 MT variance between generation and disposal manifests for Q1 2025.',
    area: 'Environment', dueDate: '2025-05-15',
    impact: 'GPCB consent renewal risk'
  },
  {
    id: 'GAP-007', severity: 'minor',
    framework: 'ISO 45001', requirement: 'Clause 6.1.2',
    title: 'HIRA not updated for modified pipe rack',
    desc: 'Pipe rack modification completed in Feb 2025 but Hazard Identification & Risk Assessment not updated.',
    area: 'Utilities', dueDate: '2025-06-01',
    impact: 'Audit non-conformance'
  }
];

export const auditReadiness = [
  { name: 'Management Review Minutes (Q1)', status: 'pass', detail: 'Completed 15-Mar-2025' },
  { name: 'Internal Audit Schedule 2025', status: 'pass', detail: '4 of 12 audits completed' },
  { name: 'CAPA Log — Open Items', status: 'partial', detail: '7 open CAPAs, 3 overdue' },
  { name: 'Training Records — Current Year', status: 'pass', detail: '87% completion rate' },
  { name: 'Emergency Drill Records', status: 'pass', detail: 'Last drill: 28-Feb-2025' },
  { name: 'Calibration Certificates', status: 'partial', detail: '12 instruments overdue' },
  { name: 'Environmental Monitoring Data', status: 'fail', detail: 'Q1 stack emission report pending' },
  { name: 'Contractor Safety Records', status: 'pass', detail: 'All permits verified' },
  { name: 'Document Control — Revision Status', status: 'partial', detail: '8 SOPs awaiting revision' },
  { name: 'Waste Disposal Manifests', status: 'fail', detail: '2.3 MT variance unresolved' }
];

export const overallComplianceScore = 89;
