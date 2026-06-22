// ========================================
// IKIP Knowledge Graph Page
// ========================================

import * as d3 from 'd3';
import { graphNodes, graphEdges, nodeTypeConfig as staticNodeTypeConfig } from '../data/knowledge-graph.js';

export function render(container) {
  container.innerHTML = `
    <div class="page kg-page">
      <!-- Page Header -->
      <div class="page-header animate-fade-in-down">
        <h1>Knowledge Graph Viewer</h1>
        <p>Interactive graph connecting refinery assets, documentation, standards, and personnel</p>
      </div>

      <!-- Main Layout -->
      <div class="kg-layout">
        <!-- Graph Area -->
        <div class="kg-graph-container glass-card-static stagger-1">
          <!-- Controls -->
          <div class="kg-controls">
            <button id="zoom-in" title="Zoom In">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
            <button id="zoom-out" title="Zoom Out">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
            <button id="zoom-reset" title="Reset View">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
              </svg>
            </button>
          </div>

          <!-- D3 Target SVG -->
          <svg id="kg-svg">
            <g id="loading-text">
              <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="var(--text-muted)" font-family="var(--font-sans)">
                Loading Live Entity Graph...
              </text>
            </g>
          </svg>

          <!-- Legend -->
          <div class="kg-legend" id="kg-legend-container">
            <!-- Populated dynamically -->
          </div>
        </div>

        <!-- Sidebar Area -->
        <div class="kg-sidebar stagger-2">
          <!-- Search Panel -->
          <div class="glass-card search-panel">
            <div class="search-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="search-icon">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input type="text" id="kg-search" class="search-input" placeholder="Search node name or type..." />
            </div>
          </div>

          <!-- Stats Panel -->
          <div class="glass-card stats-panel">
            <div class="kg-stats-grid">
              <div class="kg-stat">
                <div class="kg-stat-value" id="stats-nodes-count">-</div>
                <div class="kg-stat-label">Nodes</div>
              </div>
              <div class="kg-stat">
                <div class="kg-stat-value" id="stats-edges-count">-</div>
                <div class="kg-stat-label">Edges</div>
              </div>
              <div class="kg-stat">
                <div class="kg-stat-value">5</div>
                <div class="kg-stat-label">Types</div>
              </div>
              <div class="kg-stat">
                <div class="kg-stat-value">2</div>
                <div class="kg-stat-label">Plants</div>
              </div>
            </div>
          </div>

          <!-- Node Detail Panel -->
          <div class="glass-card node-detail-panel">
            <div id="kg-node-detail" class="kg-node-detail">
              <div class="empty-detail-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
                </svg>
                <h3>Select a node</h3>
                <p>Click any node in the knowledge graph to inspect its parameters, documentation, and relationships.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Fetch dynamic graph nodes/links from the backend
  fetch('/api/graph')
    .then(res => res.json())
    .then(data => {
      // Remove loading indicator
      d3.select('#loading-text').remove();
      
      // Update Stats
      container.querySelector('#stats-nodes-count').textContent = data.nodes.length;
      container.querySelector('#stats-edges-count').textContent = data.links.length;

      // Populate Legend
      const legendContainer = container.querySelector('#kg-legend-container');
      legendContainer.innerHTML = Object.entries(data.nodeTypeConfig).map(([type, cfg]) => `
        <div class="legend-item" data-type="${type}">
          <span class="legend-dot" style="background-color: ${cfg.color}"></span>
          <span class="legend-label">${type.charAt(0).toUpperCase() + type.slice(1)}</span>
        </div>
      `).join('');

      buildD3Graph(data.nodes, data.links, data.nodeTypeConfig);
    })
    .catch(err => {
      console.warn('Backend graph offline. Rendering static fallback graph.', err);
      d3.select('#loading-text').remove();
      
      container.querySelector('#stats-nodes-count').textContent = graphNodes.length;
      container.querySelector('#stats-edges-count').textContent = graphEdges.length;

      const legendContainer = container.querySelector('#kg-legend-container');
      legendContainer.innerHTML = Object.entries(staticNodeTypeConfig).map(([type, cfg]) => `
        <div class="legend-item" data-type="${type}">
          <span class="legend-dot" style="background-color: ${cfg.color}"></span>
          <span class="legend-label">${cfg.label}</span>
        </div>
      `).join('');

      // Fallback clone
      const fallbackNodes = graphNodes.map(n => ({ ...n }));
      const fallbackLinks = graphEdges.map(e => ({ ...e }));
      buildD3Graph(fallbackNodes, fallbackLinks, staticNodeTypeConfig);
    });

  // Graph builder function
  function buildD3Graph(nodes, links, nodeTypeConfig) {
    const svg = d3.select('#kg-svg');
    const containerElement = document.querySelector('.kg-graph-container');
    const width = containerElement.clientWidth;
    const height = containerElement.clientHeight || 550;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const g = svg.append('g');

    // Zoom setup
    const zoom = d3.zoom()
      .scaleExtent([0.1, 8])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Force simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(80))
      .force('charge', d3.forceManyBody().strength(-180))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide(25));

    // Links
    const link = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('class', 'link')
      .attr('stroke', '#334155')
      .attr('stroke-width', 1.5)
      .attr('stroke-opacity', 0.4);

    // Nodes
    const node = g.append('g')
      .attr('class', 'nodes')
      .selectAll('.node')
      .data(nodes)
      .enter().append('g')
      .attr('class', 'node')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))
      .on('click', handleNodeClick)
      .on('mouseover', handleMouseOver)
      .on('mouseout', handleMouseOut);

    // Circles
    node.append('circle')
      .attr('r', d => nodeTypeConfig[d.type]?.radius || 10)
      .attr('fill', d => nodeTypeConfig[d.type]?.color || '#94A3B8')
      .attr('stroke', 'rgba(255, 255, 255, 0.15)')
      .attr('stroke-width', 1.5);

    // Labels
    node.append('text')
      .attr('dy', d => (nodeTypeConfig[d.type]?.radius || 10) + 12)
      .attr('text-anchor', 'middle')
      .text(d => d.label)
      .attr('fill', 'var(--text-secondary)')
      .style('font-size', '10px');

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // Drag behavior
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Zoom controls
    container.querySelector('#zoom-in').addEventListener('click', () => {
      svg.transition().duration(250).call(zoom.scaleBy, 1.3);
    });

    container.querySelector('#zoom-out').addEventListener('click', () => {
      svg.transition().duration(250).call(zoom.scaleBy, 0.7);
    });

    container.querySelector('#zoom-reset').addEventListener('click', () => {
      svg.transition().duration(250).call(zoom.transform, d3.zoomIdentity);
    });

    // Hover highlighting
    function handleMouseOver(event, d) {
      const connectedNodeIds = new Set();
      connectedNodeIds.add(d.id);

      link.attr('stroke-opacity', l => {
        if (l.source.id === d.id || l.target.id === d.id) {
          connectedNodeIds.add(l.source.id);
          connectedNodeIds.add(l.target.id);
          return 0.9;
        }
        return 0.1;
      }).attr('stroke-width', l => (l.source.id === d.id || l.target.id === d.id) ? 2.5 : 1);

      node.attr('opacity', n => connectedNodeIds.has(n.id) ? 1 : 0.25);
    }

    function handleMouseOut() {
      link.attr('stroke-opacity', 0.4).attr('stroke-width', 1.5);
      node.attr('opacity', 1);
    }

    // Node click handler
    function handleNodeClick(event, d) {
      const detailPanel = container.querySelector('#kg-node-detail');
      const color = nodeTypeConfig[d.type]?.color || '#94A3B8';
      
      const connections = links.filter(l => l.source.id === d.id || l.target.id === d.id).map(l => {
        const isSource = l.source.id === d.id;
        const targetNode = isSource ? l.target : l.source;
        return {
          id: targetNode.id,
          label: targetNode.label,
          type: targetNode.type,
          color: nodeTypeConfig[targetNode.type]?.color,
          relType: l.type,
          relLabel: l.label
        };
      });

      let propsHtml = '';
      const ignoreProps = ['id', 'x', 'y', 'vx', 'vy', 'fx', 'fy', 'index', 'type', 'label'];
      Object.entries(d).forEach(([key, value]) => {
        if (!ignoreProps.includes(key) && value) {
          const label = key.charAt(0).toUpperCase() + key.slice(1);
          propsHtml += `
            <div class="kg-node-prop">
              <span class="prop-key">${label}:</span>
              <span class="prop-val">${value}</span>
            </div>
          `;
        }
      });

      detailPanel.innerHTML = `
        <div class="kg-detail-view animate-fade-in-up">
          <div class="kg-detail-header">
            <span class="kg-node-type" style="background-color: ${color}20; color: ${color}; border: 1px solid ${color}40;">
              ${d.type.toUpperCase()}
            </span>
            <h2 class="kg-node-name">${d.label}</h2>
          </div>

          <div class="kg-node-props">
            ${propsHtml || '<p class="text-muted">No additional properties listed</p>'}
          </div>

          <div class="kg-connections-section">
            <h4>Relationships (${connections.length})</h4>
            <div class="kg-connections">
              ${connections.map(conn => `
                <div class="kg-connection-item" data-id="${conn.id}">
                  <span class="kg-connection-dot" style="background-color: ${conn.color}"></span>
                  <div class="kg-connection-info">
                    <span class="conn-node">${conn.label}</span>
                    <span class="conn-rel-label">${conn.relLabel}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;

      // Sidebar connection navigation
      detailPanel.querySelectorAll('.kg-connection-item').forEach(item => {
        item.addEventListener('click', () => {
          const targetId = item.getAttribute('data-id');
          const targetNode = nodes.find(n => n.id === targetId);
          if (targetNode) {
            handleNodeClick(null, targetNode);
            const transform = d3.zoomIdentity
              .translate(width / 2 - targetNode.x, height / 2 - targetNode.y)
              .scale(1.2);
            svg.transition().duration(500).call(zoom.transform, transform);
          }
        });
      });
    }

    // Legend filters
    let activeFilters = new Set(Object.keys(nodeTypeConfig));
    container.querySelectorAll('.legend-item').forEach(item => {
      item.addEventListener('click', () => {
        const type = item.getAttribute('data-type');
        if (activeFilters.has(type)) {
          activeFilters.delete(type);
          item.classList.add('inactive');
        } else {
          activeFilters.add(type);
          item.classList.remove('inactive');
        }

        node.style('display', n => activeFilters.has(n.type) ? 'block' : 'none');
        link.style('display', l => (activeFilters.has(l.source.type) && activeFilters.has(l.target.type)) ? 'block' : 'none');
      });
    });

    // Search filter
    const searchInput = container.querySelector('#kg-search');
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      if (!query) {
        node.attr('opacity', 1);
        link.attr('stroke-opacity', 0.4);
        return;
      }

      node.attr('opacity', n => {
        const match = n.label.toLowerCase().includes(query) || n.type.toLowerCase().includes(query) || (n.subtype && n.subtype.toLowerCase().includes(query));
        return match ? 1 : 0.15;
      });

      link.attr('stroke-opacity', l => {
        const matchSource = l.source.label.toLowerCase().includes(query) || l.source.type.toLowerCase().includes(query);
        const matchTarget = l.target.label.toLowerCase().includes(query) || l.target.type.toLowerCase().includes(query);
        return (matchSource && matchTarget) ? 0.4 : 0.05;
      });
    });
  }
}
