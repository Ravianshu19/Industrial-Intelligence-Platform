// ========================================
// IKIP Document Ingestion Engine Page
// ========================================

import { documents, supportedFormats, processingPipeline } from '../data/documents.js';

export function render(container) {
  let activeFilter = 'all';

  function generateDocListHtml(filter) {
    const filteredDocs = filter === 'all' 
      ? documents 
      : documents.filter(doc => doc.type === filter);

    if (filteredDocs.length === 0) {
      return `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          <h3>No documents found</h3>
          <p>No documents matching the selected category.</p>
        </div>
      `;
    }

    return filteredDocs.map(doc => {
      const formatClass = doc.format.toLowerCase();
      const statusClass = doc.status === 'processed' ? 'badge-success' : 'badge-warning';
      const entityCount = Object.values(doc.entities || {}).reduce((acc, curr) => acc + curr.length, 0);

      return `
        <div class="doc-item animate-fade-in-up" data-id="${doc.id}">
          <div class="doc-icon ${formatClass}">${doc.format.toUpperCase()}</div>
          <div class="doc-info">
            <div class="doc-name">${doc.name}</div>
            <div class="doc-meta">
              <span>${doc.category}</span> • 
              <span>${doc.plant}</span> • 
              <span>${doc.size}</span> • 
              <span>Uploaded: ${doc.uploadDate}</span>
            </div>
          </div>
          <div class="doc-entities-count">
            <strong>${entityCount}</strong> entities
          </div>
          <div class="badge ${statusClass}">${doc.status.toUpperCase()}</div>
        </div>
      `;
    }).join('');
  }

  function updateDocList() {
    const docListContainer = container.querySelector('.doc-list');
    if (docListContainer) {
      docListContainer.innerHTML = generateDocListHtml(activeFilter);
    }
  }

  container.innerHTML = `
    <div class="page ingestion-page">
      <!-- Page Header -->
      <div class="page-header animate-fade-in-down">
        <h1>Document Ingestion Engine</h1>
        <p>AI-powered ingestion, structure extraction, and metadata indexing pipeline</p>
      </div>

      <!-- Top Grid: Upload Zone and Processing Pipeline -->
      <div class="ingestion-grid">
        <!-- Upload Zone -->
        <div class="glass-card upload-card stagger-1">
          <div class="section-header">
            <h2>Upload Documents</h2>
            <p>Drag and drop technical files to run cognitive extraction</p>
          </div>

          <div class="upload-zone" id="upload-zone">
            <div class="upload-zone-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <h3>Drop files here or click to browse</h3>
            <p>Files are parsed locally and vectorized for search</p>
            
            <div class="upload-formats">
              ${supportedFormats.map(fmt => `<span class="tag">${fmt}</span>`).join('')}
            </div>
          </div>

          <!-- Hidden input for file selection -->
          <input type="file" id="file-input" style="display: none;" multiple />
        </div>

        <!-- Processing Pipeline -->
        <div class="glass-card pipeline-card stagger-2">
          <div class="section-header">
            <h2>Extraction Pipeline</h2>
            <p>Real-time processing status of the ingestion pipeline</p>
          </div>

          <div class="pipeline-container">
            ${processingPipeline.map(step => {
              let statusClass = 'pending';
              let statusLabel = 'Pending';
              
              if (step.step < 4) {
                statusClass = 'completed';
                statusLabel = 'Completed';
              } else if (step.step === 4) {
                statusClass = 'active pulse';
                statusLabel = 'Processing';
              }

              return `
                <div class="pipeline-step ${statusClass}">
                  <div class="pipeline-step-icon">
                    <span>${step.icon}</span>
                  </div>
                  <div class="pipeline-step-content">
                    <div class="pipeline-step-header">
                      <h3>${step.name}</h3>
                      <span class="pipeline-status-badge">${statusLabel}</span>
                    </div>
                    <p>${step.desc}</p>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- Entity Extraction Preview -->
      <div class="glass-card-static entity-preview-card stagger-3">
        <div class="section-header">
          <h2>Cognitive Extraction Preview</h2>
          <p>Extracted entity tokens from the latest processed document: <strong id="preview-doc-title">DOC-002 (Maintenance WO - E-101)</strong></p>
        </div>

        <div class="entity-preview-container">
          <div class="entity-group">
            <span class="entity-group-label">Equipment Tags:</span>
            <div class="entity-tags" id="preview-equipment">
              <span class="entity-tag equipment">E-101</span>
              <span class="entity-tag equipment">CDU-1</span>
              <span class="entity-tag equipment">T-101</span>
            </div>
          </div>

          <div class="entity-group">
            <span class="entity-group-label">Parameters & Measurements:</span>
            <div class="entity-tags" id="preview-parameters">
              <span class="entity-tag parameter">MTBF: 8,760 hrs</span>
              <span class="entity-tag parameter">Tube wall: 2.1mm</span>
              <span class="entity-tag parameter">TAN: 1.5</span>
              <span class="entity-tag parameter">Press: 2.5 kg/cm²</span>
            </div>
          </div>

          <div class="entity-group">
            <span class="entity-group-label">Regulatory & Standard Citations:</span>
            <div class="entity-tags" id="preview-regulations">
              <span class="entity-tag regulation">API 660</span>
              <span class="entity-tag regulation">ASME Sec VIII</span>
              <span class="entity-tag regulation">OISD-STD-118</span>
            </div>
          </div>

          <div class="entity-group">
            <span class="entity-group-label">Personnel:</span>
            <div class="entity-tags" id="preview-personnel">
              <span class="entity-tag personnel">K. Patel (Maint. Supervisor)</span>
              <span class="entity-tag personnel">D. Singh (Technician)</span>
            </div>
          </div>

          <div class="entity-group">
            <span class="entity-group-label">Key Dates:</span>
            <div class="entity-tags" id="preview-dates">
              <span class="entity-tag date">2025-01-08</span>
              <span class="entity-tag date">Next Maint: 2025-07-15</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Document Library Section -->
      <div class="glass-card-static doc-library-card stagger-4">
        <div class="flex-between doc-library-header">
          <div class="section-header">
            <h2>Refinery Document Library</h2>
            <p>Repository of all processed refinery engineering, maintenance, and compliance files</p>
          </div>
          <div class="doc-count">Total: <strong>15</strong> files</div>
        </div>

        <!-- Filter Row -->
        <div class="library-filters">
          <span class="chip active" data-filter="all">All Files</span>
          <span class="chip" data-filter="pid">P&ID Drawings</span>
          <span class="chip" data-filter="workorder">Work Orders</span>
          <span class="chip" data-filter="sop">SOPs</span>
          <span class="chip" data-filter="inspection">Inspections</span>
          <span class="chip" data-filter="manual">OEM Manuals</span>
        </div>

        <!-- Document List -->
        <div class="doc-list">
          ${generateDocListHtml('all')}
        </div>
      </div>
    </div>
  `;

  // Interactivity handlers

  // 1. Upload Zone Drag-and-Drop & Click
  const uploadZone = container.querySelector('#upload-zone');
  const fileInput = container.querySelector('#file-input');

  uploadZone.addEventListener('click', () => {
    fileInput.click();
  });

  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('dragover');
  });

  uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('dragover');
  });

  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    const files = e.dataTransfer.files;
    simulateIngestion(files);
  });

  fileInput.addEventListener('change', (e) => {
    const files = e.target.files;
    simulateIngestion(files);
  });

  // Simulate ingestion animation
  function simulateIngestion(files) {
    if (files.length === 0) return;
    
    const file = files[0];
    const fileName = file.name;
    
    // Change upload zone text to processing
    const originalHtml = uploadZone.innerHTML;
    uploadZone.innerHTML = `
      <div class="upload-zone-icon rotating">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="2" x2="12" y2="6"/>
          <line x1="12" y1="18" x2="12" y2="22"/>
          <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
          <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
          <line x1="2" y1="12" x2="6" y2="12"/>
          <line x1="18" y1="12" x2="22" y2="12"/>
          <line x1="6.34" y1="17.66" x2="9.17" y2="14.83"/>
          <line x1="14.83" y1="9.17" x2="17.66" y2="6.34"/>
        </svg>
      </div>
      <h3>Processing ${fileName}...</h3>
      <p>Running OCR, extracting equipment codes and compiling connections...</p>
    `;

    // Highlight pipeline steps
    const steps = container.querySelectorAll('.pipeline-step');
    steps.forEach(step => {
      step.className = 'pipeline-step pending';
      step.querySelector('.pipeline-status-badge').textContent = 'Pending';
    });

    // Read the file as text and upload to server
    let uploadSuccess = false;
    let uploadError = null;
    let uploadResult = null;
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        const content = event.target.result;
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name: fileName, content })
        });
        
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Server returned ${res.status}`);
        }
        
        uploadResult = await res.json();
        uploadSuccess = true;
      } catch (err) {
        console.error('Error during upload:', err);
        uploadError = err.message;
      }
    };

    reader.onerror = () => {
      uploadError = 'File reading error';
    };

    reader.readAsText(file);

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep > 0) {
        steps[currentStep - 1].className = 'pipeline-step completed';
        steps[currentStep - 1].querySelector('.pipeline-status-badge').textContent = 'Completed';
      }
      
      if (currentStep < 6) {
        steps[currentStep].className = 'pipeline-step active pulse';
        steps[currentStep].querySelector('.pipeline-status-badge').textContent = 'Processing';
        currentStep++;
      } else {
        clearInterval(interval);
        
        // Finalize ingestion simulation
        uploadZone.innerHTML = originalHtml;
        
        if (uploadError) {
          alert(`Error ingesting "${fileName}": ${uploadError}`);
        } else {
          alert(`Successfully ingested "${fileName}"! Placed into Refinery Database and mapped to the Knowledge Graph.`);
          
          if (uploadResult && uploadResult.entities) {
            updatePreviewCard(fileName, uploadResult.entities);
          }
          
          // Add a mock document to the documents list array dynamically and redraw list
          const fileExt = fileName.split('.').pop() || 'pdf';
          const newDocType = fileName.toLowerCase().includes('incident') ? 'incident' : 
                             fileName.toLowerCase().includes('sop') ? 'sop' : 
                             fileName.toLowerCase().includes('compliance') ? 'compliance' : 'pid';
          documents.unshift({
            id: `DOC-NEW-${Math.floor(Math.random() * 1000)}`,
            name: fileName.replace(/\.[^/.]+$/, ""),
            type: newDocType,
            format: fileExt.toLowerCase(),
            category: 'Uploaded Document',
            plant: 'IOCL Gujarat Refinery',
            unit: 'CDU-1',
            uploadDate: new Date().toISOString().split('T')[0],
            size: '2.4 MB',
            status: 'processed',
            entities: uploadResult && uploadResult.entities ? uploadResult.entities : {
              equipment: ['E-101', 'CDU-1'],
              parameters: ['250°C'],
              regulations: ['OISD-STD-118'],
              personnel: ['Self']
            },
            confidence: 97
          });
          updateDocList();
        }
        
        // reset upload handlers
        simulateIngestionReset();
      }
    }, 1000);
  }

  function updatePreviewCard(fileName, entities) {
    const titleEl = container.querySelector('#preview-doc-title');
    const equipEl = container.querySelector('#preview-equipment');
    const paramEl = container.querySelector('#preview-parameters');
    const regEl = container.querySelector('#preview-regulations');
    const persEl = container.querySelector('#preview-personnel');
    const dateEl = container.querySelector('#preview-dates');

    if (titleEl) titleEl.textContent = fileName;
    
    if (equipEl) {
      equipEl.innerHTML = entities.equipment && entities.equipment.length > 0 
        ? entities.equipment.map(e => `<span class="entity-tag equipment">${e}</span>`).join('')
        : `<span style="font-size: 11px; color: var(--text-dim);">No equipment tags detected</span>`;
    }
    
    if (paramEl) {
      paramEl.innerHTML = entities.parameters && entities.parameters.length > 0
        ? entities.parameters.map(p => `<span class="entity-tag parameter">${p}</span>`).join('')
        : `<span style="font-size: 11px; color: var(--text-dim);">No parameters detected</span>`;
    }

    if (regEl) {
      regEl.innerHTML = entities.regulations && entities.regulations.length > 0
        ? entities.regulations.map(r => `<span class="entity-tag regulation">${r}</span>`).join('')
        : `<span style="font-size: 11px; color: var(--text-dim);">No citations detected</span>`;
    }

    if (persEl) {
      persEl.innerHTML = entities.personnel && entities.personnel.length > 0
        ? entities.personnel.map(p => `<span class="entity-tag personnel">${p}</span>`).join('')
        : `<span style="font-size: 11px; color: var(--text-dim);">No personnel detected</span>`;
    }

    if (dateEl) {
      dateEl.innerHTML = entities.dates && entities.dates.length > 0
        ? entities.dates.map(d => `<span class="entity-tag date">${d}</span>`).join('')
        : `<span class="entity-tag date">${new Date().toISOString().split('T')[0]}</span>`;
    }
  }


  function simulateIngestionReset() {
    // Re-attach upload handlers since innerHTML cleared them
    const newUploadZone = container.querySelector('#upload-zone');
    const newFileInput = container.querySelector('#file-input');

    newUploadZone.addEventListener('click', () => {
      newFileInput.click();
    });

    newUploadZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      newUploadZone.classList.add('dragover');
    });

    newUploadZone.addEventListener('dragleave', () => {
      newUploadZone.classList.remove('dragover');
    });

    newUploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      newUploadZone.classList.remove('dragover');
      simulateIngestion(e.dataTransfer.files);
    });

    newFileInput.addEventListener('change', (e) => {
      simulateIngestion(e.target.files);
    });
  }

  // 2. Filter chips click toggles active state and filters document list
  const chips = container.querySelectorAll('.library-filters .chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeFilter = chip.getAttribute('data-filter');
      updateDocList();
    });
  });
}
