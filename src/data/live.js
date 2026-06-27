// ========================================
// Live corpus data — maps /api/insights into the shapes the pages render.
// ========================================
// The Maintenance / Compliance / Failure pages render from these mappers when
// the backend returns corpus insights, and fall back to the static demo arrays
// only if the API is unreachable. This is what makes the dashboards reflect the
// real document corpus (and update as documents are uploaded) rather than
// hand-authored constants.

export async function fetchInsights() {
  try {
    const res = await fetch('/api/insights');
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null; // backend down → caller uses static fallback
  }
}

// Equipment health cards (Maintenance page).
export function mapEquipmentHealth(insights) {
  if (!insights || !insights.equipment || insights.equipment.length === 0) return null;
  return insights.equipment.map(e => ({
    id: e.id,
    health: e.status === 'operating' ? 'good' : e.status, // template expects good|warning|critical
    name: `${e.subtype} ${e.id}`,
    unit: e.plant,
    mtbf: '—',   // corpus has no reliability timeline
    mttr: '—',
    lastMaint: '—',
    healthScore: e.healthScore,
    prediction: `${e.failureMode}. Referenced in ${e.sourceCount} document${e.sourceCount === 1 ? '' : 's'}`
      + (e.parameters.length ? ` · params: ${e.parameters.join(', ')}` : '') + '.'
  }));
}

// Regulatory frameworks (Compliance page) — coverage derived from how many
// documents reference each standard.
export function mapFrameworks(insights) {
  if (!insights || !insights.regulations || insights.regulations.length === 0) return null;
  return insights.regulations.map(r => ({
    id: r.id,
    name: r.id,
    authority: r.authority,
    score: Math.min(99, 55 + r.documentsReferencing * 15), // coverage proxy
    total: r.documentsReferencing,
    compliant: r.documentsReferencing,
    gaps: 0,
    icon: '📘',
    desc: `${r.documentsReferencing} document(s) reference this standard`
  }));
}

// Compliance gaps (Compliance page) — lines flagged as deficiencies in the corpus.
export function mapGaps(insights) {
  if (!insights || !insights.gaps) return null;
  return insights.gaps.map((g, i) => ({
    id: `GAP-${String(i + 1).padStart(3, '0')}`,
    severity: g.severity,
    framework: g.source,
    requirement: g.source,
    title: g.text.length > 90 ? g.text.slice(0, 87) + '…' : g.text,
    desc: g.text,
    area: g.source,
    dueDate: '—',
    impact: 'Flagged automatically from corpus document'
  }));
}

// Overall compliance index, computed from the corpus gap profile.
export function computeOverallScore(gaps) {
  if (!gaps || gaps.length === 0) return 95;
  const crit = gaps.filter(g => g.severity === 'critical').length;
  const major = gaps.filter(g => g.severity === 'major').length;
  return Math.max(40, Math.min(99, 100 - crit * 7 - major * 3));
}

// Incidents (Failure Intelligence page).
export function mapIncidents(insights) {
  if (!insights || !insights.incidents || insights.incidents.length === 0) return null;
  return insights.incidents.map((n, i) => ({
    id: `INC-${String(i + 1).padStart(3, '0')}`,
    date: n.date || '—',
    severity: /fire|incident|investigation/i.test(n.title) ? 'high' : 'medium',
    title: n.title,
    desc: n.rootCauses[0] || 'Investigation record identified in the corpus.',
    area: 'Refinery',
    plant: 'IOCL Gujarat Refinery',
    equipment: n.equipment,
    tags: n.equipment,
    rootCause: n.rootCauses.join(' '),
    corrective: '',
    preventive: ''
  }));
}
