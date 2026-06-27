// ========================================
// IKIP Corpus Insights — derive page data from the real document corpus
// ========================================
// The Maintenance / Compliance / Failure pages historically rendered static
// hand-authored data. This module computes the same shapes from the actual
// documents in documents-raw/ (via the entity parser + text scanning), so the
// dashboards reflect what is really in the corpus and update as files are
// uploaded. Non-derivable projections (MTBF trend lines, RCA trees) stay in the
// frontend as clearly-illustrative scaffolding.

import fs from 'fs';
import { parseDocument } from './parser.js';

const STATUS_SCORE = { operating: 88, warning: 65, critical: 38 };

// Map an equipment subtype prefix to a readable failure-mode hint by scanning
// the surrounding document text for known degradation keywords.
const FAILURE_KEYWORDS = [
  [/corrosion|under-deposit|wall thickness/i, 'Corrosion / wall-thinning'],
  [/foul|deposit|cleaning/i, 'Fouling / deposits'],
  [/vibration|bearing/i, 'Bearing wear / vibration'],
  [/fire|static|roof seal/i, 'Fire / static-discharge'],
  [/leak|gasket|flange/i, 'Leak / gasket failure'],
  [/relief|overpressure|psv|esd/i, 'Overpressure / relief']
];

function authorityFor(reg) {
  if (reg.startsWith('OISD')) return 'OISD / MoPNG';
  if (reg.startsWith('ISO')) return 'ISO';
  if (reg.startsWith('API')) return 'API';
  if (reg.startsWith('ASME')) return 'ASME';
  if (reg.startsWith('IS ')) return 'BIS';
  return 'Standard';
}

// Build the full insight bundle from every corpus file.
export function computeInsights(files) {
  const docs = files.map(fp => {
    const content = fs.readFileSync(fp, 'utf-8');
    const title = content.split('\n')[0].replace(/^#+\s*/, '').trim();
    const { nodes } = parseDocument(fp);
    return { fp, content, title, nodes };
  });

  return {
    generatedAt: new Date().toISOString(),
    corpusSize: docs.length,
    equipment: computeEquipment(docs),
    regulations: computeRegulations(docs),
    gaps: computeGaps(docs),
    incidents: computeIncidents(docs),
    personnel: computePersonnel(docs)
  };
}

// Equipment health, derived from extracted equipment tags + their context.
function computeEquipment(docs) {
  const byId = new Map();

  docs.forEach(doc => {
    const params = doc.nodes.filter(n => n.type === 'parameter').map(n => n.id);
    doc.nodes.filter(n => n.type === 'equipment').forEach(eq => {
      if (!byId.has(eq.id)) {
        byId.set(eq.id, {
          id: eq.id,
          subtype: eq.subtype || 'Equipment',
          status: eq.status || 'operating',
          plant: eq.plant || 'IOCL Gujarat Refinery',
          mentionedIn: new Set(),
          parameters: new Set(),
          failureMode: null
        });
      }
      const rec = byId.get(eq.id);
      rec.mentionedIn.add(doc.title);
      // Upgrade status toward the most severe seen across documents.
      if (eq.status === 'critical') rec.status = 'critical';
      else if (eq.status === 'warning' && rec.status !== 'critical') rec.status = 'warning';
      params.forEach(p => rec.parameters.add(p));
      if (!rec.failureMode) {
        const hit = FAILURE_KEYWORDS.find(([re]) => re.test(doc.content));
        if (hit) rec.failureMode = hit[1];
      }
    });
  });

  return Array.from(byId.values())
    .map(r => ({
      id: r.id,
      subtype: r.subtype,
      status: r.status,
      healthScore: STATUS_SCORE[r.status] ?? 80,
      plant: r.plant,
      failureMode: r.failureMode || 'Operating within parameters',
      parameters: Array.from(r.parameters).slice(0, 4),
      mentionedIn: Array.from(r.mentionedIn),
      sourceCount: r.mentionedIn.size
    }))
    .sort((a, b) => a.healthScore - b.healthScore); // worst health first
}

// Regulatory coverage: each standard + how many documents reference it.
function computeRegulations(docs) {
  const byId = new Map();
  docs.forEach(doc => {
    new Set(doc.nodes.filter(n => n.type === 'regulation').map(n => n.id)).forEach(reg => {
      if (!byId.has(reg)) byId.set(reg, new Set());
      byId.get(reg).add(doc.title);
    });
  });

  return Array.from(byId.entries())
    .map(([id, set]) => ({
      id,
      authority: authorityFor(id),
      documentsReferencing: set.size,
      coverage: set.size >= 3 ? 'well-covered' : set.size === 2 ? 'covered' : 'thin',
      sources: Array.from(set)
    }))
    .sort((a, b) => b.documentsReferencing - a.documentsReferencing);
}

// Compliance gaps: lines in the corpus that flag a deficiency.
function computeGaps(docs) {
  const gaps = [];
  const GAP_LINE = /(non[- ]?compliance|gap[:\s]|overdue|pending|exceed|deficien|not (yet )?(complete|tested|calibrated|scheduled|updated))/i;

  docs.forEach(doc => {
    doc.content.split('\n').forEach(raw => {
      // Strip markdown emphasis/list markers and label prefixes for clean display.
      const line = raw.replace(/\*\*/g, '').replace(/^[\s\-*•]+/, '').replace(/^Status:\s*/i, '').trim();
      if (line.length < 12 || line.startsWith('#')) return;
      if (!GAP_LINE.test(line)) return;
      const severity = /exceed|overdue|non[- ]?compliance|fail/i.test(line)
        ? 'critical'
        : /pending|deficien|not /i.test(line) ? 'major' : 'minor';
      gaps.push({
        source: doc.title,
        severity,
        text: line.length > 220 ? line.slice(0, 217) + '…' : line
      });
    });
  });
  // De-duplicate identical lines, cap for readability.
  const seen = new Set();
  return gaps.filter(g => (seen.has(g.text) ? false : seen.add(g.text))).slice(0, 12);
}

// Incidents / investigations found in the corpus.
function computeIncidents(docs) {
  return docs
    .filter(doc => /incident|fire|investigation|near[- ]?miss|root cause/i.test(doc.content))
    .map(doc => {
      const equipment = Array.from(new Set(doc.nodes.filter(n => n.type === 'equipment').map(n => n.id)));
      // Root-cause lines: a "root cause" heading/label, or bullets under one.
      const rootCauses = doc.content
        .split('\n')
        .map(l => l.replace(/^[\s\-*•]+/, '').trim())
        .filter(l => /root cause|caused by|due to|exceeded the safety/i.test(l))
        .slice(0, 3);
      const dateMatch = doc.content.match(/\b(\d{4}-\d{2}-\d{2}|[A-Z][a-z]+ \d{1,2},? \d{4})\b/);
      return {
        title: doc.title,
        date: dateMatch ? dateMatch[0] : null,
        equipment: equipment.slice(0, 6),
        rootCauses,
        isIncident: /incident|fire|investigation|near[- ]?miss/i.test(doc.title)
      };
    })
    // Keep genuine incident/investigation reports, or any doc with a clear
    // multi-line root-cause analysis — exclude routine filings/assessments.
    .filter(i => i.isIncident || i.rootCauses.length >= 2)
    .map(({ isIncident, ...rest }) => rest);
}

// Personnel + inferred roles, with the documents that name them.
function computePersonnel(docs) {
  const byName = new Map();
  docs.forEach(doc => {
    doc.nodes.filter(n => n.type === 'personnel').forEach(p => {
      if (!byName.has(p.id)) byName.set(p.id, { name: p.id, role: p.role || 'Personnel', docs: new Set() });
      byName.get(p.id).docs.add(doc.title);
    });
  });
  return Array.from(byName.values()).map(p => ({ name: p.name, role: p.role, sourceCount: p.docs.size }));
}
