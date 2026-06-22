// ========================================
// Incidents & Failure Intelligence Data
// ========================================

export const incidents = [
  {
    id: 'INC-2024-008', date: '2024-08-30', severity: 'high',
    title: 'Minor Fire at Tank Farm TK-15',
    desc: 'Small fire at TK-15 floating roof seal area during product receipt. Fire contained within 45 minutes. No injuries. Root cause: static discharge during high-flow transfer.',
    area: 'Tank Farm', plant: 'IOCL Gujarat',
    equipment: ['TK-15', 'FF-System-2'],
    tags: ['fire', 'static-discharge', 'tank-farm', 'floating-roof'],
    rootCause: 'Static charge accumulation during high-velocity product transfer (>1.2 m/s at inlet)',
    corrective: 'Flow rate limiter installed, grounding verification completed',
    preventive: 'Anti-static additive trial approved for high-vapor-pressure products'
  },
  {
    id: 'INC-2024-005', date: '2024-06-12', severity: 'medium',
    title: 'Flare System Pressure Excursion',
    desc: 'Flare header pressure exceeded design by 15% during CDU-1 PSV lift. Flare tip OK, but knockout drum level reached 80%.',
    area: 'Utilities', plant: 'IOCL Gujarat',
    equipment: ['Flare-1', 'KO-Drum-1', 'PSV-101'],
    tags: ['overpressure', 'flare', 'psv-lift', 'process-upset'],
    rootCause: 'Simultaneous PSV lift from CDU-1 and VDU during power dip',
    corrective: 'Flare header capacity study completed',
    preventive: 'UPS backup enhanced for critical instruments'
  },
  {
    id: 'INC-2024-003', date: '2024-03-22', severity: 'low',
    title: 'Chemical Splash — Minor Injury',
    desc: 'Operator received caustic splash on forearm during sample collection at NaOH injection point. First aid administered. 1 day restricted duty.',
    area: 'CDU-1', plant: 'IOCL Gujarat',
    equipment: ['CDU-1', 'Sample-Point-SP15'],
    tags: ['chemical-exposure', 'sampling', 'ppe', 'first-aid'],
    rootCause: 'Worn sampling valve packing — drip during valve operation',
    corrective: 'Sampling valve replaced, PPE compliance reinforced',
    preventive: 'Closed-loop sampling system installation approved'
  },
  {
    id: 'INC-2025-001', date: '2025-01-15', severity: 'medium',
    title: 'Gas Leak Detection — Hydrogen at HCU',
    desc: 'LEL alarm at 35% triggered at HCU reactor outlet piping flange. Unit placed in safe condition. Leak isolated within 20 minutes.',
    area: 'HCU', plant: 'IOCL Gujarat',
    equipment: ['HCU-Reactor', 'HCU-Piping', 'GD-401'],
    tags: ['gas-leak', 'hydrogen', 'flange-leak', 'hcu'],
    rootCause: 'Flange gasket deterioration — high-temperature hydrogen attack',
    corrective: 'Gasket replaced with spiral wound SS316/graphite type',
    preventive: 'Flange management program expanded to include all HCU flanges above 350°C'
  },
  {
    id: 'INC-2025-003', date: '2025-03-05', severity: 'low',
    title: 'Near-Miss — Crane Load Exceeding SWL',
    desc: 'During planned maintenance lift, actual load 12% above SWL indicated on permit. Operation stopped by crane operator. No incident.',
    area: 'CDU-1', plant: 'IOCL Gujarat',
    equipment: ['Crane-HC250', 'E-101'],
    tags: ['lifting', 'near-miss', 'permit', 'overload'],
    rootCause: 'Weight estimation error — piping modifications not reflected in lift plan',
    corrective: 'Lift plan revised with verified weights',
    preventive: 'Mandatory weighing for all loads >5 MT before lift'
  }
];

export const nearMisses = [
  { date: '2025-04-02', desc: 'Scaffolding plank loose at 8m height — spotted during inspection', area: 'CDU-1', severity: 'medium' },
  { date: '2025-03-18', desc: 'Wrong isolation tag found on V-102 — corrected before work started', area: 'CDU-1', severity: 'high' },
  { date: '2025-03-05', desc: 'Crane load exceeded SWL by 12% — stopped by operator', area: 'CDU-1', severity: 'medium' },
  { date: '2025-02-20', desc: 'Hot work without gas test renewal — stopped by safety patrol', area: 'Tank Farm', severity: 'high' },
  { date: '2025-02-08', desc: 'Electrical cable damage during excavation — no energization', area: 'Utilities', severity: 'low' },
  { date: '2025-01-22', desc: 'Forklift reverse alarm not working — reported by warehouse staff', area: 'Stores', severity: 'low' }
];

export const failurePatterns = [
  {
    id: 'PAT-001', title: 'Corrosion Acceleration Post Crude-Slate Change',
    confidence: 94, occurrences: 12, timespan: '18 months',
    desc: 'Heat exchangers and piping in CDU-1 showing 2-3x higher corrosion rates after 2023 crude blend change to high-TAN Basrah Heavy. Pattern confirmed across E-101, E-102, E-103, and associated piping.',
    equipment: ['E-101', 'E-102', 'E-103', 'PL-CDU1'],
    relatedIncidents: ['INC-2024-005'],
    recommendation: 'Metallurgy upgrade to SS316L for all crude-contact surfaces. Estimated cost: ₹12 Cr during TA-2025.'
  },
  {
    id: 'PAT-002', title: 'Seasonal Control Valve Sticking',
    confidence: 78, occurrences: 8, timespan: '3 years',
    desc: '75% of control valve sticking events occur November-February. Correlates with crude viscosity increase during cold-weather startup. Affects FCV-101, TCV-102, LCV-103.',
    equipment: ['FCV-101', 'TCV-102', 'LCV-103'],
    relatedIncidents: [],
    recommendation: 'Implement pre-heating protocol for crude circuit during winter startups. Add steam tracing to critical valve actuators.'
  },
  {
    id: 'PAT-003', title: 'Flange Gasket Failures at High-Temperature Services',
    confidence: 82, occurrences: 6, timespan: '2 years',
    desc: 'Recurring gasket failures at flanges operating above 350°C. All failures involved compressed fiber gaskets instead of spiral-wound metallic type specified in piping spec.',
    equipment: ['HCU-Piping', 'CDU-1-Heater-Piping'],
    relatedIncidents: ['INC-2025-001'],
    recommendation: 'Audit all flanges >350°C for gasket type compliance. Replace non-conforming gaskets during next opportunity.'
  }
];

export const proactiveWarnings = [
  {
    id: 'WARN-001', severity: 'high', risk: 92,
    title: 'TK-15 Bottom Plate Integrity — Unresolved',
    desc: 'Post-fire inspection (Aug 2024) was incomplete. Bottom plate MFL survey has been rescheduled 3 times. Corrosion rate under fire-damaged insulation is unknown.',
    trigger: 'Similar pattern at HPCL Vizag led to tank floor failure in 2022',
    action: 'Expedite MFL survey. Consider tank out-of-service until inspection complete.'
  },
  {
    id: 'WARN-002', severity: 'high', risk: 85,
    title: 'GT-101 Bearing Failure — Predicted within 60 days',
    desc: '1X vibration trending at +0.17 mm/s per month. At current rate, ISO alert level (4.5 mm/s) will be reached by mid-May 2025.',
    trigger: 'Vibration pattern matches pre-failure signature from GT-102 bearing failure in 2022',
    action: 'Order replacement bearings immediately (6-week lead time). Schedule bearing swap for May outage.'
  },
  {
    id: 'WARN-003', severity: 'medium', risk: 68,
    title: 'CDU-1 ESD System — DCS Migration Risk',
    desc: 'SIL verification for 12 safety loops pending. If DCS migration proceeds without SIL signoff, safety integrity of ESD system cannot be assured.',
    trigger: 'IEC 61511 clause 11 requires SIL verification before commissioning of modified SIF',
    action: 'Complete SIL verification study before DCS cutover. Engage certified SIL assessor.'
  },
  {
    id: 'WARN-004', severity: 'low', risk: 45,
    title: 'Winter Startup Protocol — Valve Sticking Prevention',
    desc: 'Historical pattern shows 75% of valve sticking events occur in winter months. Current startup procedures do not include pre-heating protocol.',
    trigger: 'Seasonal pattern detected from 3-year work order analysis',
    action: 'Update SOP to include crude circuit pre-heating during Nov-Feb startups.'
  }
];

export const knowledgePreservation = {
  totalExperts: 142,
  retiringIn5Years: 38,
  knowledgeCaptured: 67,
  documentsFromExperts: 1240,
  interviewsCompleted: 28,
  criticalKnowledgeGaps: 12,
  metrics: [
    { label: 'Operational Procedures', captured: 82 },
    { label: 'Equipment History', captured: 74 },
    { label: 'Troubleshooting Know-how', captured: 45 },
    { label: 'Vendor Relationships', captured: 38 },
    { label: 'Regulatory Interpretation', captured: 61 },
    { label: 'Process Optimization', captured: 52 }
  ]
};
