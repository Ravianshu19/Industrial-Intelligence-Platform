// ========================================
// Expert Copilot — Pre-built Q&A Pairs
// ========================================

export const copilotResponses = [
  {
    id: 'q1',
    question: 'What is the maintenance history of heat exchanger E-101?',
    answer: `Heat Exchanger E-101 is located in CDU-1 at IOCL Gujarat Refinery. Here's a comprehensive summary:\n\n**Recent Maintenance:**\n• **Jan 2025** — Tube bundle hydrojet cleaning (WO-2025-0142). 36 man-hours, ₹4.2L cost.\n• **Jul 2024** — Tube UT survey found minimum wall 2.1mm (nominal 2.77mm). Corrosion rate: 0.15 mm/yr.\n• **Jan 2024** — Chemical cleaning with antifoulant injection.\n\n**Key Concern:** MTBF has declined from 11,800 hrs (2020) to 6,200 hrs (2025). Root cause analysis points to crude slate change to high-TAN Basrah Heavy in 2023 without corresponding HX re-rating.\n\n**AI Recommendation:** Schedule tube bundle replacement during TA-2025 (planned Jun 2025). Consider metallurgy upgrade to SS316L per API 660 re-rating study.`,
    sources: [
      { name: 'WO-2025-0142 — E-101 Tube Cleaning', type: 'Work Order', confidence: 96, format: 'pdf' },
      { name: 'P&ID CDU-1 — Rev.12', type: 'Engineering Drawing', confidence: 94, format: 'dwg' },
      { name: 'RBI Assessment Area-1 (2025)', type: 'Risk Assessment', confidence: 87, format: 'pdf' },
      { name: 'OEM Datasheet E-101', type: 'Specification', confidence: 91, format: 'pdf' }
    ],
    followups: [
      'What is the RCA for E-101 fouling?',
      'Show me the E-101 corrosion trend',
      'What spare parts are needed for E-101 tube bundle replacement?'
    ]
  },
  {
    id: 'q2',
    question: 'What are the current OISD compliance gaps?',
    answer: `Currently tracking **9 gaps** across OISD standards with an overall compliance score of **87%**. Here are the critical items:\n\n**🔴 Critical — OISD-STD-116 Cl. 5.3:**\nFire water storage capacity at 78% of requirement following TK-15 incident. FW Tank-2 bottom plate repair is pending. **Due: 30 Jun 2025.**\n\n**🟡 Major — OISD-STD-105 Cl. 8:**\nSIL verification for 12 safety loops not completed for CDU-1 DCS upgrade (Honeywell → Yokogawa migration). This blocks DCS commissioning. **Due: 15 Jul 2025.**\n\n**Upcoming Requirement:**\nOISD-STD-244 (Process Safety Management) audit due Q3 2025. 2 PSM element reviews pending.\n\n**AI Assessment:** The fire water capacity gap is the highest risk item — it directly affects refinery license renewal. Recommend prioritizing FW Tank-2 repair over other capital projects.`,
    sources: [
      { name: 'OISD Compliance Register Q1-2025', type: 'Compliance Record', confidence: 95, format: 'xlsx' },
      { name: 'MOC — DCS Upgrade CDU-1', type: 'Change Record', confidence: 93, format: 'pdf' },
      { name: 'Incident Report — TK-15 Fire', type: 'Incident Report', confidence: 95, format: 'pdf' }
    ],
    followups: [
      'Generate compliance evidence package for OISD-STD-116',
      'What is the timeline for FW Tank-2 repair?',
      'List all upcoming regulatory audits'
    ]
  },
  {
    id: 'q3',
    question: 'Has there been any pattern in equipment failures at CDU-1?',
    answer: `Analysis across **47 work orders**, **3 incident reports**, and **12 inspection records** for CDU-1 over the past 3 years reveals the following patterns:\n\n**Pattern 1: Accelerated Corrosion (High Confidence — 94%)**\nCorrosion rates across CDU-1 heat exchangers (E-101, E-102, E-103) increased 2.4x after the crude slate change in mid-2023. This correlates directly with the switch to Basrah Heavy crude (TAN > 1.5 mg KOH/g).\n\n**Pattern 2: Valve Sticking — Winter Months (Medium Confidence — 78%)**\n6 of 8 control valve sticking incidents occurred between November-February. Root cause appears to be viscosity increase in crude preheat circuit during cold weather startup.\n\n**Pattern 3: Pump Seal Failures (Medium Confidence — 72%)**\nP-101A/B seal failures correlate with high-vibration events on upstream T-101 column. Column level surges create transient flow conditions.\n\n**Cross-Unit Insight:** Similar corrosion acceleration was reported at BPCL Mumbai Refinery after switching to similar crude blend — their solution (Monel overlay on tube sheets) reduced failure rate by 68%.`,
    sources: [
      { name: 'CDU-1 Work Order Database (2022-2025)', type: 'Database Extract', confidence: 94, format: 'xlsx' },
      { name: 'Crude Assay — Basrah Heavy 2023', type: 'Laboratory Report', confidence: 88, format: 'pdf' },
      { name: 'Vibration Trending Report CDU-1', type: 'Condition Monitoring', confidence: 82, format: 'pdf' },
      { name: 'Industry Bulletin — BPCL Corrosion Mitigation', type: 'External Reference', confidence: 75, format: 'pdf' }
    ],
    followups: [
      'Show me the corrosion rate trend for CDU-1 exchangers',
      'What was the BPCL Mumbai solution for high-TAN crude?',
      'Generate a predictive maintenance schedule for CDU-1'
    ]
  },
  {
    id: 'q4',
    question: 'What is the emergency shutdown procedure for CDU-1?',
    answer: `The CDU-1 Emergency Shutdown (ESD) procedure is documented in **SOP-CDU1-ESD-Rev.08** (last updated Sep 2024). Key steps:\n\n**Level 1 — Process Trip:**\n1. Trip all fired heaters (H-101, H-102) — close fuel gas XV-101/102\n2. Close crude feed FCV-101 to zero\n3. Confirm column T-101 pressure relieving through PSV-101\n4. Switch P-101 to minimum recirculation\n\n**Level 2 — Unit Shutdown:**\n5. Begin controlled temperature reduction (max 50°C/hr)\n6. Activate steam purge to all vessels\n7. De-inventory product to slop system\n\n**Level 3 — Emergency Isolation:**\n8. Close all battery limit block valves\n9. Activate emergency flare system\n10. Notify Fire & Safety team and shift supervisor\n\n**⚠️ Important Note:** Step 3 was updated in Rev.08 after the 2024 safety audit identified that PSV-101 set pressure needed adjustment from 3.5 to 3.2 kg/cm² per re-rating study.\n\n**Personnel:** Authorized operators — Shift Supervisor must be present for Level 2 and above.`,
    sources: [
      { name: 'SOP-CDU1-ESD-Rev.08', type: 'Operating Procedure', confidence: 97, format: 'pdf' },
      { name: 'P&ID CDU-1 — Rev.12', type: 'Engineering Drawing', confidence: 94, format: 'dwg' },
      { name: 'Safety Audit Report 2024', type: 'Audit Report', confidence: 90, format: 'pdf' }
    ],
    followups: [
      'When was the last ESD drill conducted?',
      'What changed between Rev.07 and Rev.08?',
      'Show me the P&ID for CDU-1 ESD system'
    ]
  },
  {
    id: 'q5',
    question: 'What are the vibration readings for GT-101 and should we be concerned?',
    answer: `**Gas Turbine GT-101** (NTPC Vindhyachal, Unit-1) latest vibration analysis from 18-Mar-2025:\n\n| Parameter | Reading | ISO 10816 Limit | Status |\n|-----------|---------|-----------------|--------|\n| 1X (Running Speed) | 2.8 mm/s | 4.5 mm/s | ⚠️ Alert Zone |\n| 2X (Misalignment) | 1.2 mm/s | 2.5 mm/s | ✅ Normal |\n| Bearing #1 Temp | 82°C | 95°C | ⚠️ Trending Up |\n| Bearing #2 Temp | 74°C | 95°C | ✅ Normal |\n\n**AI Assessment:** While current readings are within ISO limits, the **1X vibration has increased from 1.8 mm/s to 2.8 mm/s over 6 months** — a 56% increase. Trend analysis predicts it will reach the alert threshold (4.5 mm/s) within **45-60 days** at current rate.\n\n**Recommendation:**\n1. Schedule bearing inspection during next planned outage (May 2025)\n2. Increase monitoring frequency from monthly to weekly\n3. Prepare bearing replacement spares (Lead time: 6 weeks for OEM bearings)`,
    sources: [
      { name: 'Vibration Analysis Report GT-101 (Mar 2025)', type: 'Condition Monitoring', confidence: 92, format: 'pdf' },
      { name: 'OEM Manual — Gas Turbine GT-101', type: 'Technical Manual', confidence: 89, format: 'pdf' },
      { name: 'ISO 10816-3 Vibration Limits', type: 'Standard Reference', confidence: 98, format: 'pdf' }
    ],
    followups: [
      'Show me the GT-101 vibration trend over the last year',
      'What is the lead time for GT-101 bearing replacement?',
      'Has this type of bearing failure occurred before at NTPC?'
    ]
  }
];

export const suggestedQueries = [
  'What is the maintenance history of heat exchanger E-101?',
  'What are the current OISD compliance gaps?',
  'Has there been any pattern in equipment failures at CDU-1?',
  'What is the emergency shutdown procedure for CDU-1?',
  'What are the vibration readings for GT-101 and should we be concerned?',
  'When is the next turnaround planned for CDU-1?',
  'What are the environmental emission levels for FCC-1?',
  'List all overdue maintenance work orders'
];
