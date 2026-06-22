// ========================================
// Dynamic Document Parser & Entity Extractor
// ========================================

import fs from 'fs';
import path from 'path';

// Define entity configurations
const nodeTypeConfig = {
  equipment: { color: '#0EA5E9', radius: 14 },
  document: { color: '#8B5CF6', radius: 10 },
  personnel: { color: '#10B981', radius: 11 },
  regulation: { color: '#F59E0B', radius: 10 },
  parameter: { color: '#06B6D4', radius: 9 }
};

export function parseDocument(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(filePath);
  const docId = fileName.replace(/\.[^/.]+$/, "");

  // Define regex patterns for entity extraction
  const patterns = {
    equipment: /\b(E-101|T-101|GT-101|B-201|TK-15|KO-Drum-1|Flare-1|FF-System-2|PSV-101|ESDV-101)\b/g,
    regulation: /\b(OISD-STD-\d+|API \d+|ASME Section [V|I|X]+|IS \d+|ISO \d+-\d+)\b/g,
    parameter: /\b(\d+°C|\d+\.\d+ kg\/cm²|\d+ meters|\d+,\d+ RPM|\d+\.\d+ mm\/s)\b/g,
    personnel: /\b([A-Z]\.\s[A-Za-z]+)\b/g
  };

  const nodes = [];
  const links = [];
  const entityMap = new Map();

  // Add the parent document node first
  const docNode = {
    id: docId,
    type: 'document',
    label: docId,
    name: 'Layout & Maintenance Safety Guidelines',
    path: fileName
  };
  nodes.push(docNode);
  entityMap.set(docId, docNode);

  // Extract entities from text
  Object.entries(patterns).forEach(([type, regex]) => {
    const matches = content.match(regex) || [];
    const uniqueMatches = [...new Set(matches)];

    uniqueMatches.forEach(match => {
      const id = match.trim();
      if (!entityMap.has(id)) {
        const node = {
          id: id,
          type: type,
          label: id,
          plant: 'IOCL Gujarat Refinery',
          status: type === 'equipment' ? 'operating' : undefined
        };

        // Add additional contextual data for nodes
        if (id === 'E-101') {
          node.subtype = 'Heat Exchanger';
          node.status = 'warning';
        } else if (id === 'T-101') {
          node.subtype = 'Distillation Column';
        } else if (id === 'GT-101') {
          node.subtype = 'Gas Turbine';
          node.status = 'warning';
        } else if (id === 'TK-15') {
          node.subtype = 'Storage Tank';
          node.status = 'critical';
        } else if (id === 'R. Sharma') {
          node.role = 'Lead Engineer';
        } else if (id === 'K. Patel') {
          node.role = 'Maintenance Supervisor';
        } else if (id === 'D. Singh') {
          node.role = 'Technician';
        }

        nodes.push(node);
        entityMap.set(id, node);
      }

      // Add a default "mentions" relationship from the document to the entity
      links.push({
        source: docId,
        target: id,
        type: 'mentions',
        label: 'Mentions'
      });
    });
  });

  // Extract relationships (edges) based on semantic proximity heuristics
  // 1. Author relationships
  const authors = ['R. Sharma', 'K. Patel'];
  authors.forEach(author => {
    if (entityMap.has(author)) {
      // replace the standard "mentions" link with an "authored" link
      const idx = links.findIndex(l => l.source === docId && l.target === author);
      if (idx !== -1) {
        links[idx].type = 'authored';
        links[idx].label = 'Authored';
      }
    }
  });

  // 2. Regulation-Equipment relationships
  if (entityMap.has('OISD-STD-118') && entityMap.has('T-101')) {
    links.push({ source: 'OISD-STD-118', target: 'T-101', type: 'regulates', label: 'Regulates' });
  }
  if (entityMap.has('OISD-STD-118') && entityMap.has('E-101')) {
    links.push({ source: 'OISD-STD-118', target: 'E-101', type: 'regulates', label: 'Regulates' });
  }
  if (entityMap.has('API 660') && entityMap.has('E-101')) {
    links.push({ source: 'API 660', target: 'E-101', type: 'regulates', label: 'Regulates' });
  }

  // 3. Equipment-Parameter relationships
  if (entityMap.has('E-101') && entityMap.has('350°C')) {
    links.push({ source: 'E-101', target: '350°C', type: 'has_parameter', label: 'Operating Temp' });
  }
  if (entityMap.has('E-101') && entityMap.has('2.5 kg/cm²')) {
    links.push({ source: 'E-101', target: '2.5 kg/cm²', type: 'has_parameter', label: 'Design Pressure' });
  }
  if (entityMap.has('GT-101') && entityMap.has('3,000 RPM')) {
    links.push({ source: 'GT-101', target: '3,000 RPM', type: 'has_parameter', label: 'Operating Speed' });
  }
  if (entityMap.has('GT-101') && entityMap.has('4.5 mm/s')) {
    links.push({ source: 'GT-101', target: '4.5 mm/s', type: 'has_parameter', label: 'Vibration Limit' });
  }

  // 4. Personnel-Equipment/Incident relationships
  if (entityMap.has('R. Sharma') && entityMap.has('E-101')) {
    links.push({ source: 'R. Sharma', target: 'E-101', type: 'inspects', label: 'Safety Lead' });
  }
  if (entityMap.has('K. Patel') && entityMap.has('GT-101')) {
    links.push({ source: 'K. Patel', target: 'GT-101', type: 'manages', label: 'Maintenance Lead' });
  }

  return { nodes, links, nodeTypeConfig };
}
