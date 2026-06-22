// ========================================
// Dynamic Document Parser & Entity Extractor (Generic)
// ========================================

import fs from 'fs';
import path from 'path';

const nodeTypeConfig = {
  equipment: { color: '#0EA5E9', radius: 14 },
  document: { color: '#8B5CF6', radius: 10 },
  personnel: { color: '#10B981', radius: 11 },
  regulation: { color: '#F59E0B', radius: 10 },
  parameter: { color: '#06B6D4', radius: 9 }
};

// Blacklist of terms that might match equipment regex but are actually something else
const equipmentBlacklist = new Set([
  'ASME', 'OISD', 'TEMA', 'RPM', 'HTML', 'VITE', 'D3', 'API', 'IS', 'ISO', 
  'LEL', 'DCS', 'SIL', 'SIF', 'PPE', 'NaOH', 'TEMA', 'CAPA', 'ASME-Sec', 
  'ASME-Section', 'ASME-B31', 'OISD-STD', 'ISO-10816', 'ASME-B31.3', 'ASME-B313'
]);

export function parseDocument(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(filePath);
  const docId = fileName.replace(/\.[^/.]+$/, "");

  // Regex patterns
  const patterns = {
    regulation: /\b(OISD-STD-\d+|API-\d+|API \d+|ASME\s(?:Sec(?:tion)?\s[VIX\d]+|B\d+\.\d+)|IS\s\d+|ISO\s\d+(?:-\d+)?)\b/g,
    // matches things like E-101, GT-101, TK-15, KO-Drum-1, FF-System-2, ESDV-101, etc.
    equipment: /\b([A-Z][A-Z0-9]{0,4}-(?:[A-Za-z]+-)?[0-9]{2,4}[A-Z]?)\b/g,
    parameter: /\b(\d+(?:\.\d+)?\s*(?:°C|kg\/cm²|meters|RPM|mm\/s|bar|mm|m\/s|MT))\b/g,
    personnel: /\b([A-Z]\.\s[A-Za-z]+)\b/g
  };

  const nodes = [];
  const links = [];
  const entityMap = new Map();
  const entityPositions = [];

  // 1. Add Document Node
  const docTitle = content.split('\n')[0].replace(/^#+\s*/, '') || docId;
  const docNode = {
    id: docId,
    type: 'document',
    label: docId,
    name: docTitle,
    path: fileName
  };
  nodes.push(docNode);
  entityMap.set(docId, docNode);

  // 2. Extract Entities
  // We'll run the regex matches and find their indexes in the text
  const regulationMatches = [];
  let match;

  // Extract Regulations first
  while ((match = patterns.regulation.exec(content)) !== null) {
    regulationMatches.push({ value: match[0], index: match.index });
  }

  // Extract Equipment next
  const equipmentMatches = [];
  while ((match = patterns.equipment.exec(content)) !== null) {
    const val = match[0];
    // Filter out blacklisted items or matches that are part of regulation prefixes
    if (!equipmentBlacklist.has(val) && 
        !val.startsWith('OISD') && 
        !val.startsWith('API') && 
        !val.startsWith('ASME') && 
        !val.startsWith('ISO') && 
        !val.startsWith('IS')) {
      equipmentMatches.push({ value: val, index: match.index });
    }
  }

  // Extract Parameters
  const parameterMatches = [];
  while ((match = patterns.parameter.exec(content)) !== null) {
    parameterMatches.push({ value: match[0], index: match.index });
  }

  // Extract Personnel
  const personnelMatches = [];
  while ((match = patterns.personnel.exec(content)) !== null) {
    personnelMatches.push({ value: match[0], index: match.index });
  }

  // Helper to register node
  function registerNode(id, type) {
    if (!entityMap.has(id)) {
      const node = {
        id: id,
        type: type,
        label: id,
        plant: 'IOCL Gujarat Refinery'
      };

      // Add intelligent defaults based on label heuristics
      if (type === 'equipment') {
        node.status = id.includes('critical') || id === 'TK-15' ? 'critical' : id === 'E-101' || id === 'GT-101' ? 'warning' : 'operating';
        if (id.startsWith('E-')) node.subtype = 'Heat Exchanger';
        else if (id.startsWith('GT-')) node.subtype = 'Gas Turbine';
        else if (id.startsWith('T-')) node.subtype = 'Distillation Column';
        else if (id.startsWith('TK-')) node.subtype = 'Storage Tank';
        else if (id.startsWith('P-')) node.subtype = 'Centrifugal Pump';
      } else if (type === 'personnel') {
        if (id.includes('Sharma')) node.role = 'Lead Engineer';
        else if (id.includes('Patel')) node.role = 'Maintenance Supervisor';
        else if (id.includes('Singh')) node.role = 'Technician';
      }

      nodes.push(node);
      entityMap.set(id, node);
    }
  }

  // Register all nodes and save positions
  const allMatches = [
    { type: 'regulation', items: regulationMatches },
    { type: 'equipment', items: equipmentMatches },
    { type: 'parameter', items: parameterMatches },
    { type: 'personnel', items: personnelMatches }
  ];

  allMatches.forEach(({ type, items }) => {
    items.forEach(item => {
      registerNode(item.value, type);
      entityPositions.push({
        id: item.value,
        type: type,
        index: item.index
      });
      
      // Default doc reference link
      links.push({
        source: docId,
        target: item.value,
        type: 'mentions',
        label: 'Mentions'
      });
    });
  });

  // 3. Proximity-based Relationship Extraction
  // Sort positions by index
  entityPositions.sort((a, b) => a.index - b.index);

  // If two entities appear within 100 characters, construct a relationship
  const PROXIMITY_THRESHOLD = 100;
  for (let i = 0; i < entityPositions.length; i++) {
    for (let j = i + 1; j < entityPositions.length; j++) {
      const a = entityPositions[i];
      const b = entityPositions[j];

      // Skip if they are the same entity
      if (a.id === b.id) continue;

      const distance = Math.abs(a.index - b.index);
      if (distance <= PROXIMITY_THRESHOLD) {
        // Construct typed relationship links
        let source = a.id;
        let target = b.id;
        let type = 'associated_with';
        let label = 'Associated';

        if (a.type === 'regulation' && b.type === 'equipment') {
          source = a.id; target = b.id; type = 'regulates'; label = 'Regulates';
        } else if (b.type === 'regulation' && a.type === 'equipment') {
          source = b.id; target = a.id; type = 'regulates'; label = 'Regulates';
        } else if (a.type === 'equipment' && b.type === 'parameter') {
          source = a.id; target = b.id; type = 'has_parameter'; label = 'Has Parameter';
        } else if (b.type === 'equipment' && a.type === 'parameter') {
          source = b.id; target = a.id; type = 'has_parameter'; label = 'Has Parameter';
        } else if (a.type === 'personnel' && b.type === 'equipment') {
          source = a.id; target = b.id; type = 'assigned_to'; label = 'Assigned To';
        } else if (b.type === 'personnel' && a.type === 'equipment') {
          source = b.id; target = a.id; type = 'assigned_to'; label = 'Assigned To';
        } else if (a.type === 'personnel' && b.type === 'document') {
          source = a.id; target = b.id; type = 'authored'; label = 'Authored';
        } else if (b.type === 'personnel' && a.type === 'document') {
          source = b.id; target = a.id; type = 'authored'; label = 'Authored';
        }

        // Avoid adding duplicate links
        const exists = links.some(l => l.source === source && l.target === target && l.type === type);
        if (!exists) {
          // If we upgraded a link from a generic "mentions" from the doc node, remove the old mentions link
          if (type === 'authored') {
            const mentionsIdx = links.findIndex(l => l.source === docId && l.target === (source === docId ? target : source) && l.type === 'mentions');
            if (mentionsIdx !== -1) links.splice(mentionsIdx, 1);
          }
          links.push({ source, target, type, label });
        }
      }
    }
  }

  return { nodes, links, nodeTypeConfig };
}
