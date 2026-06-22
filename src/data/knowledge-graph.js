// ========================================
// Knowledge Graph Data
// ========================================

export const graphNodes = [
  // Equipment nodes
  { id: 'CDU-1', type: 'equipment', label: 'CDU-1', subtype: 'Crude Distillation Unit', plant: 'IOCL Gujarat', status: 'operating' },
  { id: 'E-101', type: 'equipment', label: 'E-101', subtype: 'Heat Exchanger', plant: 'IOCL Gujarat', status: 'warning' },
  { id: 'E-102', type: 'equipment', label: 'E-102', subtype: 'Heat Exchanger', plant: 'IOCL Gujarat', status: 'operating' },
  { id: 'P-101A', type: 'equipment', label: 'P-101A', subtype: 'Centrifugal Pump', plant: 'IOCL Gujarat', status: 'operating' },
  { id: 'P-101B', type: 'equipment', label: 'P-101B', subtype: 'Centrifugal Pump (Standby)', plant: 'IOCL Gujarat', status: 'standby' },
  { id: 'V-101', type: 'equipment', label: 'V-101', subtype: 'Reflux Drum', plant: 'IOCL Gujarat', status: 'operating' },
  { id: 'T-101', type: 'equipment', label: 'T-101', subtype: 'Distillation Column', plant: 'IOCL Gujarat', status: 'operating' },
  { id: 'K-301', type: 'equipment', label: 'K-301', subtype: 'Centrifugal Compressor', plant: 'IOCL Gujarat', status: 'operating' },
  { id: 'FCC-1', type: 'equipment', label: 'FCC-1', subtype: 'Fluid Catalytic Cracker', plant: 'IOCL Gujarat', status: 'operating' },
  { id: 'TK-15', type: 'equipment', label: 'TK-15', subtype: 'Storage Tank', plant: 'IOCL Gujarat', status: 'critical' },
  { id: 'B-201', type: 'equipment', label: 'B-201', subtype: 'Boiler', plant: 'NTPC Vindhyachal', status: 'operating' },
  { id: 'GT-101', type: 'equipment', label: 'GT-101', subtype: 'Gas Turbine', plant: 'NTPC Vindhyachal', status: 'warning' },
  { id: 'BF-3', type: 'equipment', label: 'BF-3', subtype: 'Blast Furnace', plant: 'Tata Steel Jamshedpur', status: 'operating' },
  { id: 'PL-205', type: 'equipment', label: 'PL-205', subtype: 'Pipeline', plant: 'IOCL Gujarat', status: 'operating' },
  { id: 'PSV-101', type: 'equipment', label: 'PSV-101', subtype: 'Safety Valve', plant: 'IOCL Gujarat', status: 'operating' },

  // Document nodes
  { id: 'DOC-001', type: 'document', label: 'P&ID CDU-1', subtype: 'Engineering Drawing', docType: 'pid' },
  { id: 'DOC-002', type: 'document', label: 'WO E-101 Tube Bundle', subtype: 'Work Order', docType: 'workorder' },
  { id: 'DOC-003', type: 'document', label: 'SOP ESD CDU-1', subtype: 'Operating Procedure', docType: 'sop' },
  { id: 'DOC-004', type: 'document', label: 'Inspection B-201', subtype: 'Inspection Report', docType: 'inspection' },
  { id: 'DOC-005', type: 'document', label: 'NCR BF-3 Weld', subtype: 'Quality NCR', docType: 'ncr' },
  { id: 'DOC-007', type: 'document', label: 'OEM K-301 Manual', subtype: 'OEM Manual', docType: 'manual' },
  { id: 'DOC-008', type: 'document', label: 'Incident TK-15 Fire', subtype: 'Incident Report', docType: 'incident' },
  { id: 'DOC-010', type: 'document', label: 'Vibration GT-101', subtype: 'Condition Monitoring', docType: 'inspection' },
  { id: 'DOC-012', type: 'document', label: 'Corrosion PL-205', subtype: 'Inspection Report', docType: 'inspection' },

  // Personnel nodes
  { id: 'PER-001', type: 'personnel', label: 'R. Sharma', subtype: 'Lead Engineer', department: 'Engineering' },
  { id: 'PER-002', type: 'personnel', label: 'K. Patel', subtype: 'Maint. Supervisor', department: 'Maintenance' },
  { id: 'PER-003', type: 'personnel', label: 'S. Kumar', subtype: 'Safety Officer', department: 'HSE' },
  { id: 'PER-004', type: 'personnel', label: 'A. Deshmukh', subtype: 'TA Manager', department: 'Projects' },
  { id: 'PER-005', type: 'personnel', label: 'V. Krishnan', subtype: 'CBM Engineer', department: 'Reliability' },
  { id: 'PER-006', type: 'personnel', label: 'M. Gupta', subtype: 'IBR Inspector', department: 'Inspection' },
  { id: 'PER-007', type: 'personnel', label: 'J. Mehta', subtype: 'Corrosion Engr.', department: 'Integrity' },

  // Regulation nodes
  { id: 'REG-001', type: 'regulation', label: 'OISD-STD-118', subtype: 'Layout Standard', authority: 'OISD' },
  { id: 'REG-002', type: 'regulation', label: 'OISD-STD-105', subtype: 'Safety Instrumentation', authority: 'OISD' },
  { id: 'REG-003', type: 'regulation', label: 'Factory Act 1948', subtype: 'Worker Safety', authority: 'Govt. of India' },
  { id: 'REG-004', type: 'regulation', label: 'IBR 1950', subtype: 'Boiler Regulations', authority: 'Govt. of India' },
  { id: 'REG-005', type: 'regulation', label: 'PESO Rules', subtype: 'Petroleum Storage', authority: 'PESO' },
  { id: 'REG-006', type: 'regulation', label: 'API 660', subtype: 'Heat Exchangers', authority: 'API' },
  { id: 'REG-007', type: 'regulation', label: 'ISO 10816', subtype: 'Vibration Limits', authority: 'ISO' },
  { id: 'REG-008', type: 'regulation', label: 'CPCB Standards', subtype: 'Emission Limits', authority: 'CPCB' },
  { id: 'REG-009', type: 'regulation', label: 'API 570', subtype: 'Piping Inspection', authority: 'API' },

  // Process Parameter nodes
  { id: 'PAR-001', type: 'parameter', label: 'CDU-1 Temp', subtype: '350°C', unit: '°C', value: 350 },
  { id: 'PAR-002', type: 'parameter', label: 'CDU-1 Pressure', subtype: '2.5 kg/cm²', unit: 'kg/cm²', value: 2.5 },
  { id: 'PAR-003', type: 'parameter', label: 'K-301 Speed', subtype: '11,500 RPM', unit: 'RPM', value: 11500 },
  { id: 'PAR-004', type: 'parameter', label: 'B-201 Steam', subtype: '540°C/170 kg/cm²', unit: 'Multi', value: 540 },
  { id: 'PAR-005', type: 'parameter', label: 'PL-205 Wall', subtype: '4.8mm min', unit: 'mm', value: 4.8 },
  { id: 'PAR-006', type: 'parameter', label: 'GT-101 Vibration', subtype: '2.8 mm/s', unit: 'mm/s', value: 2.8 }
];

export const graphEdges = [
  // Equipment-Document relationships
  { source: 'CDU-1', target: 'DOC-001', type: 'documented_by', label: 'P&ID' },
  { source: 'CDU-1', target: 'DOC-003', type: 'documented_by', label: 'SOP' },
  { source: 'E-101', target: 'DOC-001', type: 'appears_in', label: 'Referenced' },
  { source: 'E-101', target: 'DOC-002', type: 'documented_by', label: 'Work Order' },
  { source: 'B-201', target: 'DOC-004', type: 'documented_by', label: 'Inspection' },
  { source: 'BF-3', target: 'DOC-005', type: 'documented_by', label: 'NCR' },
  { source: 'K-301', target: 'DOC-007', type: 'documented_by', label: 'OEM Manual' },
  { source: 'TK-15', target: 'DOC-008', type: 'documented_by', label: 'Incident' },
  { source: 'GT-101', target: 'DOC-010', type: 'documented_by', label: 'Vibration' },
  { source: 'PL-205', target: 'DOC-012', type: 'documented_by', label: 'Corrosion' },

  // Equipment-Equipment relationships
  { source: 'CDU-1', target: 'E-101', type: 'contains', label: 'Part of' },
  { source: 'CDU-1', target: 'E-102', type: 'contains', label: 'Part of' },
  { source: 'CDU-1', target: 'P-101A', type: 'contains', label: 'Part of' },
  { source: 'CDU-1', target: 'P-101B', type: 'contains', label: 'Standby' },
  { source: 'CDU-1', target: 'V-101', type: 'contains', label: 'Part of' },
  { source: 'CDU-1', target: 'T-101', type: 'contains', label: 'Part of' },
  { source: 'CDU-1', target: 'PSV-101', type: 'protected_by', label: 'Safety' },
  { source: 'P-101A', target: 'P-101B', type: 'standby_for', label: 'Redundant' },
  { source: 'E-101', target: 'T-101', type: 'feeds', label: 'Process Flow' },
  { source: 'T-101', target: 'V-101', type: 'feeds', label: 'Overhead' },

  // Personnel-Equipment relationships
  { source: 'PER-001', target: 'CDU-1', type: 'responsible_for', label: 'Lead' },
  { source: 'PER-002', target: 'E-101', type: 'maintains', label: 'Supervisor' },
  { source: 'PER-003', target: 'TK-15', type: 'investigated', label: 'Safety' },
  { source: 'PER-004', target: 'CDU-1', type: 'manages', label: 'TA Manager' },
  { source: 'PER-005', target: 'GT-101', type: 'monitors', label: 'CBM' },
  { source: 'PER-006', target: 'B-201', type: 'inspected', label: 'IBR' },
  { source: 'PER-007', target: 'PL-205', type: 'monitors', label: 'Corrosion' },

  // Personnel-Document relationships
  { source: 'PER-001', target: 'DOC-001', type: 'authored', label: 'Created' },
  { source: 'PER-002', target: 'DOC-002', type: 'authored', label: 'Created' },
  { source: 'PER-003', target: 'DOC-008', type: 'authored', label: 'Investigated' },

  // Regulation-Equipment relationships
  { source: 'REG-001', target: 'CDU-1', type: 'regulates', label: 'Layout' },
  { source: 'REG-002', target: 'CDU-1', type: 'regulates', label: 'SIS' },
  { source: 'REG-003', target: 'CDU-1', type: 'regulates', label: 'Safety' },
  { source: 'REG-004', target: 'B-201', type: 'regulates', label: 'Boiler' },
  { source: 'REG-005', target: 'TK-15', type: 'regulates', label: 'Storage' },
  { source: 'REG-006', target: 'E-101', type: 'regulates', label: 'HX Design' },
  { source: 'REG-007', target: 'GT-101', type: 'regulates', label: 'Vibration' },
  { source: 'REG-008', target: 'FCC-1', type: 'regulates', label: 'Emissions' },
  { source: 'REG-009', target: 'PL-205', type: 'regulates', label: 'Piping' },

  // Equipment-Parameter relationships
  { source: 'CDU-1', target: 'PAR-001', type: 'has_parameter', label: 'Temp' },
  { source: 'CDU-1', target: 'PAR-002', type: 'has_parameter', label: 'Pressure' },
  { source: 'K-301', target: 'PAR-003', type: 'has_parameter', label: 'Speed' },
  { source: 'B-201', target: 'PAR-004', type: 'has_parameter', label: 'Steam' },
  { source: 'PL-205', target: 'PAR-005', type: 'has_parameter', label: 'Wall' },
  { source: 'GT-101', target: 'PAR-006', type: 'has_parameter', label: 'Vibration' }
];

export const nodeTypeConfig = {
  equipment:  { color: '#0EA5E9', label: 'Equipment', radius: 14 },
  document:   { color: '#8B5CF6', label: 'Documents', radius: 10 },
  personnel:  { color: '#10B981', label: 'Personnel', radius: 11 },
  regulation: { color: '#F59E0B', label: 'Regulations', radius: 10 },
  parameter:  { color: '#06B6D4', label: 'Parameters', radius: 9 }
};
