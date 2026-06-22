// ========================================
// Maintenance Intelligence Data
// ========================================

export const equipmentHealth = [
  {
    id: 'E-101', name: 'Heat Exchanger E-101', unit: 'CDU-1', plant: 'IOCL Gujarat',
    health: 'warning', healthScore: 62,
    mtbf: '6,200 hrs', mttr: '48 hrs', lastMaint: '2025-01-08',
    nextMaint: '2025-07-15', failureMode: 'Tube fouling & corrosion',
    prediction: 'Tube bundle replacement recommended within 90 days'
  },
  {
    id: 'GT-101', name: 'Gas Turbine GT-101', unit: 'Unit-1', plant: 'NTPC Vindhyachal',
    health: 'warning', healthScore: 71,
    mtbf: '12,400 hrs', mttr: '72 hrs', lastMaint: '2024-11-20',
    nextMaint: '2025-05-20', failureMode: 'Bearing wear / Vibration',
    prediction: 'Bearing inspection recommended — 1X vibration trending upward'
  },
  {
    id: 'K-301', name: 'Compressor K-301', unit: 'HCU', plant: 'IOCL Gujarat',
    health: 'good', healthScore: 89,
    mtbf: '18,200 hrs', mttr: '96 hrs', lastMaint: '2025-02-15',
    nextMaint: '2025-12-01', failureMode: 'Dry gas seal leak',
    prediction: 'Operating within normal parameters. Continue monitoring.'
  },
  {
    id: 'P-101A', name: 'Pump P-101A', unit: 'CDU-1', plant: 'IOCL Gujarat',
    health: 'good', healthScore: 85,
    mtbf: '8,760 hrs', mttr: '24 hrs', lastMaint: '2025-03-10',
    nextMaint: '2025-09-10', failureMode: 'Mechanical seal failure',
    prediction: 'Normal wear. Seal replacement during next turnaround.'
  },
  {
    id: 'TK-15', name: 'Storage Tank TK-15', unit: 'Tank Farm', plant: 'IOCL Gujarat',
    health: 'critical', healthScore: 38,
    mtbf: 'N/A', mttr: '120 hrs', lastMaint: '2024-08-30',
    nextMaint: 'OVERDUE', failureMode: 'Bottom plate corrosion',
    prediction: 'URGENT: Post-fire inspection incomplete. Bottom plate integrity uncertain.'
  },
  {
    id: 'B-201', name: 'Boiler B-201', unit: 'Unit-3', plant: 'NTPC Vindhyachal',
    health: 'good', healthScore: 82,
    mtbf: '26,000 hrs', mttr: '168 hrs', lastMaint: '2025-02-14',
    nextMaint: '2026-02-14', failureMode: 'Tube leak / Soot blower',
    prediction: 'IBR survey passed. Monitor waterwall thickness Zone C.'
  }
];

export const workOrderHistory = [
  { id: 'WO-2025-0142', equipment: 'E-101', type: 'Corrective', priority: 'High', status: 'completed', date: '2025-01-08', desc: 'Tube bundle cleaning — hydrojet', hours: 36, cost: '₹4.2L' },
  { id: 'WO-2025-0098', equipment: 'GT-101', type: 'Predictive', priority: 'Medium', status: 'completed', date: '2025-03-18', desc: 'Vibration analysis & bearing inspection', hours: 8, cost: '₹85K' },
  { id: 'WO-2025-0201', equipment: 'P-101A', type: 'Preventive', priority: 'Low', status: 'completed', date: '2025-03-10', desc: 'Mechanical seal replacement', hours: 12, cost: '₹1.8L' },
  { id: 'WO-2025-0178', equipment: 'K-301', type: 'Preventive', priority: 'Medium', status: 'completed', date: '2025-02-15', desc: 'DGS filter replacement & alignment check', hours: 16, cost: '₹3.1L' },
  { id: 'WO-2024-0892', equipment: 'TK-15', type: 'Emergency', priority: 'Critical', status: 'completed', date: '2024-08-30', desc: 'Post-fire inspection & repair', hours: 240, cost: '₹28L' },
  { id: 'WO-2025-0215', equipment: 'E-101', type: 'Predictive', priority: 'High', status: 'open', date: '2025-05-01', desc: 'Tube wall thickness survey — UT', hours: 16, cost: '₹1.2L' },
  { id: 'WO-2025-0220', equipment: 'TK-15', type: 'Corrective', priority: 'Critical', status: 'open', date: '2025-05-15', desc: 'Bottom plate inspection — MFL survey', hours: 48, cost: '₹6.5L' }
];

export const rcaTree = {
  title: 'E-101 Heat Exchanger — Recurring Tube Fouling',
  type: 'root',
  desc: 'MTBF decreased from 12,000 hrs to 6,200 hrs over 3 years',
  children: [
    {
      title: 'High tube-side fouling rate',
      type: 'cause',
      desc: 'Fouling factor increased 3x — crude slate change not reflected in design',
      children: [
        {
          title: 'Crude blend change (2023)',
          type: 'contributing',
          desc: 'Shifted to high-TAN crude (Basrah Heavy) without HX re-rating',
          children: [
            {
              title: 'Re-rate E-101 for current crude slate',
              type: 'solution',
              desc: 'Update thermal design per API 660. Consider metallurgy upgrade to SS316L.'
            }
          ]
        },
        {
          title: 'Inadequate chemical treatment',
          type: 'contributing',
          desc: 'Antifoulant dosage not updated for new crude properties',
          children: [
            {
              title: 'Update chemical treatment program',
              type: 'solution',
              desc: 'Engage vendor for new antifoulant trial. Target TAN neutralization.'
            }
          ]
        }
      ]
    },
    {
      title: 'Shell-side corrosion acceleration',
      type: 'cause',
      desc: 'Under-deposit corrosion detected during last cleaning',
      children: [
        {
          title: 'Velocity-induced erosion at inlet',
          type: 'contributing',
          desc: 'CFD analysis shows 4.2 m/s at tube inlet — above API 660 limits',
          children: [
            {
              title: 'Install impingement plate at inlet',
              type: 'solution',
              desc: 'Add impingement baffles per TEMA RCB design. Schedule during TA-2025.'
            }
          ]
        }
      ]
    }
  ]
};

export const predictiveSchedule = [
  { equipment: 'TK-15', task: 'Bottom plate MFL survey', status: 'overdue', date: '2025-04-15', priority: 'Critical', reason: 'Post-fire integrity assessment incomplete' },
  { equipment: 'E-101', task: 'Tube UT thickness survey', status: 'upcoming', date: '2025-05-01', priority: 'High', reason: 'AI predicts <2mm wall in Zone C based on corrosion rate trending' },
  { equipment: 'GT-101', task: 'Bearing replacement', status: 'upcoming', date: '2025-05-20', priority: 'High', reason: '1X vibration trending upward — predicted to exceed ISO alert in 45 days' },
  { equipment: 'P-101A', task: 'Alignment check', status: 'scheduled', date: '2025-09-10', priority: 'Medium', reason: 'Regular preventive maintenance cycle' },
  { equipment: 'K-301', task: 'Annual overhaul', status: 'scheduled', date: '2025-12-01', priority: 'Medium', reason: 'OEM recommended 18-month interval' },
  { equipment: 'B-201', task: 'IBR annual survey', status: 'scheduled', date: '2026-02-14', priority: 'Medium', reason: 'Statutory requirement — IBR 1950' }
];

export const mtbfTrend = {
  labels: ['2020', '2021', '2022', '2023', '2024', '2025'],
  datasets: [
    { label: 'E-101 (Heat Exchanger)', data: [11800, 10200, 8900, 7400, 6800, 6200], color: '#F59E0B' },
    { label: 'K-301 (Compressor)', data: [17500, 17800, 18000, 18200, 18100, 18200], color: '#10B981' },
    { label: 'P-101A (Pump)', data: [8500, 8600, 8700, 8800, 8700, 8760], color: '#0EA5E9' }
  ]
};
