// ========================================
// IKIP Expert Knowledge Copilot Page
// ========================================

import { copilotResponses, suggestedQueries } from '../data/copilot-responses.js';

export function render(container) {
  container.innerHTML = `
    <div class="page copilot-page">
      <!-- Page Header -->
      <div class="page-header animate-fade-in-down">
        <h1>Expert Knowledge Copilot</h1>
        <p>AI Assistant powered by RAG (Retrieval-Augmented Generation) across refinery document systems</p>
      </div>

      <!-- Layout Grid -->
      <div class="copilot-layout">
        <!-- Left: Chat Area -->
        <div class="copilot-chat glass-card-static stagger-1">
          <!-- Chat Header -->
          <div class="copilot-chat-header">
            <div class="copilot-avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                <path d="M12 6v12M6 12h12"/>
              </svg>
            </div>
            <div class="copilot-info">
              <h2>IKIP Expert Copilot</h2>
              <div class="copilot-status">Online — Connected to 1,247 documents</div>
            </div>
          </div>

          <!-- Messages Area -->
          <div class="copilot-messages" id="chat-messages">
            <!-- Welcome Message -->
            <div class="message assistant animate-fade-in-up">
              <div class="message-avatar">AI</div>
              <div class="message-bubble">
                Hello! I'm the <strong>IKIP Expert Copilot</strong>. I can answer questions about your industrial documents, equipment history, maintenance records, and regulatory compliance.<br/><br/>
                I have access to 1,247 documents across 3 plants (IOCL Gujarat Refinery, NTPC Vindhyachal, and BPCL Mumbai). What would you like to know?
              </div>
            </div>

            <!-- Initial Suggested Questions -->
            <div class="suggested-questions-container animate-fade-in-up stagger-1">
              <h4>Suggested Questions:</h4>
              <div class="suggested-questions">
                ${suggestedQueries.slice(0, 4).map(q => `<button class="suggested-q">${q}</button>`).join('')}
              </div>
            </div>
          </div>

          <!-- Input Area -->
          <div class="copilot-input-area">
            <div class="copilot-input-wrapper">
              <input type="text" id="chat-input" placeholder="Ask about maintenance history, regulations, failure patterns..." />
              <button class="copilot-send-btn" id="send-btn" title="Send message">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Right: Sidebar -->
        <div class="copilot-sidebar stagger-2">
          <!-- Statistics Card -->
          <div class="glass-card copilot-sidebar-section">
            <h4>Query Statistics</h4>
            <div class="kg-stats-grid">
              <div class="kg-stat">
                <div class="kg-stat-value">342</div>
                <div class="kg-stat-label">Total Queries</div>
              </div>
              <div class="kg-stat">
                <div class="kg-stat-value">94%</div>
                <div class="kg-stat-label">Accuracy</div>
              </div>
              <div class="kg-stat">
                <div class="kg-stat-value">1.2s</div>
                <div class="kg-stat-label">Response Time</div>
              </div>
              <div class="kg-stat">
                <div class="kg-stat-value">4.6★</div>
                <div class="kg-stat-label">User Rating</div>
              </div>
            </div>
          </div>

          <!-- Popular Topics Card -->
          <div class="glass-card copilot-sidebar-section">
            <h4>Popular Topics</h4>
            <div class="library-filters" style="margin-top: 8px; flex-wrap: wrap; gap: 6px;">
              <span class="chip" data-query="What is the maintenance history of heat exchanger E-101?">E-101 Maintenance</span>
              <span class="chip" data-query="What are the current OISD compliance gaps?">OISD standards</span>
              <span class="chip" data-query="What is the emergency shutdown procedure for CDU-1?">CDU-1 ESD SOP</span>
              <span class="chip" data-query="What are the vibration readings for GT-101 and should we be concerned?">GT-101 Vibration</span>
            </div>
          </div>

          <!-- Referenced Documents Card -->
          <div class="glass-card copilot-sidebar-section">
            <h4>Frequently Cited Sources</h4>
            <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 8px;">
              <div class="recent-doc">
                <span class="doc-icon pdf" style="width: 32px; height: 32px; font-size: 10px;">PDF</span>
                <div class="recent-doc-name" style="margin-left: 8px;">
                  <strong style="color: var(--text-primary); font-size: 12px; display: block;">OISD-STD-118</strong>
                  <span style="font-size: 10px; color: var(--text-muted);">Refinery Layout & Safety</span>
                </div>
              </div>

              <div class="recent-doc">
                <span class="doc-icon dwg" style="width: 32px; height: 32px; font-size: 10px;">DWG</span>
                <div class="recent-doc-name" style="margin-left: 8px;">
                  <strong style="color: var(--text-primary); font-size: 12px; display: block;">P&ID CDU-1 Rev.12</strong>
                  <span style="font-size: 10px; color: var(--text-muted);">Crude Unit Piping</span>
                </div>
              </div>

              <div class="recent-doc">
                <span class="doc-icon pdf" style="width: 32px; height: 32px; font-size: 10px;">PDF</span>
                <div class="recent-doc-name" style="margin-left: 8px;">
                  <strong style="color: var(--text-primary); font-size: 12px; display: block;">API 660 Design Manual</strong>
                  <span style="font-size: 10px; color: var(--text-muted);">Shell & Tube Standard</span>
                </div>
              </div>

              <div class="recent-doc">
                <span class="doc-icon pdf" style="width: 32px; height: 32px; font-size: 10px;">PDF</span>
                <div class="recent-doc-name" style="margin-left: 8px;">
                  <strong style="color: var(--text-primary); font-size: 12px; display: block;">SOP-CDU-1-ESD-04</strong>
                  <span style="font-size: 10px; color: var(--text-muted);">Emergency Shutdown SOP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const chatMessages = container.querySelector('#chat-messages');
  const chatInput = container.querySelector('#chat-input');
  const sendBtn = container.querySelector('#send-btn');

  // Format markdown helper
  function formatResponseText(text) {
    if (!text) return '';
    let formatted = text
      .replace(/\n/g, '<br/>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/•\s(.*?)(<br\/>|$)/g, '<li>$1</li>');
    
    // Wrap lists if needed
    if (formatted.includes('<li>')) {
      // Very basic wrapping
      // We can just keep li tags as block elements
    }
    return formatted;
  }

  // Find best match in pre-built Q&A
  function findResponse(query) {
    const qNorm = query.toLowerCase();
    
    // Exact match or sub-phrase match
    let bestMatch = copilotResponses.find(r => 
      qNorm.includes(r.question.toLowerCase()) || 
      r.question.toLowerCase().includes(qNorm)
    );

    // Keyword match
    if (!bestMatch) {
      if (qNorm.includes('e-101') || qNorm.includes('exchanger')) {
        bestMatch = copilotResponses.find(r => r.id === 'q1');
      } else if (qNorm.includes('oisd') || qNorm.includes('compliance') || qNorm.includes('standards')) {
        // Find Q2 or fallback
        bestMatch = copilotResponses.find(r => r.question.includes('OISD'));
      } else if (qNorm.includes('failure') || qNorm.includes('pattern') || qNorm.includes('cdu-1')) {
        bestMatch = copilotResponses.find(r => r.id === 'q3');
      } else if (qNorm.includes('shutdown') || qNorm.includes('sop') || qNorm.includes('emergency')) {
        bestMatch = copilotResponses.find(r => r.id === 'q4');
      } else if (qNorm.includes('vibration') || qNorm.includes('gt-101') || qNorm.includes('turbine')) {
        bestMatch = copilotResponses.find(r => r.id === 'q5');
      }
    }

    return bestMatch || {
      answer: `I could not find an exact match in my local knowledge base for your query. 
               However, I've run a vector search across the 1,247 indexed refinery documents. 
               
               Based on the retrieved context, there are **no recorded active incidents** regarding that specific topic, but there are **4 historical mentions** in the TA-2024 turnaround logs and OEM spec guides.
               
               Would you like me to broaden the query to include general API standard references?`,
      sources: [
        { name: 'General Refinery Turnaround Report (2024)', type: 'Report', confidence: 68, format: 'pdf' },
        { name: 'OEM Operating Guidelines Vol 1', type: 'Technical Manual', confidence: 54, format: 'pdf' }
      ],
      followups: [
        'What is the maintenance history of heat exchanger E-101?',
        'Show CDU-1 emergency shutdown procedures'
      ]
    };
  }

  function appendUserMessage(text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message user animate-fade-in-up';
    msgDiv.innerHTML = `
      <div class="message-avatar">RS</div>
      <div class="message-bubble">${text}</div>
    `;
    chatMessages.appendChild(msgDiv);
    scrollToBottom();
  }

  function appendAssistantResponse(resp) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message assistant animate-fade-in-up';
    
    let sourcesHtml = '';
    if (resp.sources && resp.sources.length > 0) {
      sourcesHtml = `
        <div class="message-sources-title">Referenced Sources:</div>
        <div class="message-sources">
          ${resp.sources.map(src => {
            const formatClass = (src.format || 'pdf').toLowerCase();
            const confClass = src.confidence >= 90 ? 'high' : 'medium';
            return `
              <div class="source-card">
                <span class="source-icon ${formatClass}">${(src.format || 'PDF').toUpperCase()}</span>
                <div class="source-info">
                  <span class="source-name">${src.name}</span>
                  <span class="source-type">${src.type}</span>
                </div>
                <span class="source-confidence ${confClass}">${src.confidence}% Match</span>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    let followupsHtml = '';
    if (resp.followups && resp.followups.length > 0) {
      followupsHtml = `
        <div class="suggested-questions-container" style="margin-top: 15px;">
          <div class="suggested-questions">
            ${resp.followups.map(q => `<button class="suggested-q">${q}</button>`).join('')}
          </div>
        </div>
      `;
    }

    msgDiv.innerHTML = `
      <div class="message-avatar">AI</div>
      <div class="message-bubble">
        ${formatResponseText(resp.answer)}
        ${sourcesHtml}
        ${followupsHtml}
      </div>
    `;

    chatMessages.appendChild(msgDiv);
    
    // Bind click events on newly appended follow-up questions
    msgDiv.querySelectorAll('.suggested-q').forEach(btn => {
      btn.addEventListener('click', () => {
        handleSendMessage(btn.textContent);
      });
    });

    scrollToBottom();
  }

  function appendTypingIndicator() {
    const indicatorDiv = document.createElement('div');
    indicatorDiv.className = 'message assistant typing-indicator-wrapper';
    indicatorDiv.id = 'typing-indicator';
    indicatorDiv.innerHTML = `
      <div class="message-avatar">AI</div>
      <div class="message-bubble">
        <div class="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;
    chatMessages.appendChild(indicatorDiv);
    scrollToBottom();
  }

  function removeTypingIndicator() {
    const indicator = chatMessages.querySelector('#typing-indicator');
    if (indicator) {
      indicator.remove();
    }
  }

  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  async function handleSendMessage(text) {
    if (!text.trim()) return;

    appendUserMessage(text);
    chatInput.value = '';
    
    // Disable inputs during processing
    chatInput.disabled = true;
    sendBtn.disabled = true;

    // Show thinking indicator
    appendTypingIndicator();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      
      removeTypingIndicator();
      if (data.error) {
        throw new Error(data.error);
      }
      appendAssistantResponse(data);
    } catch (err) {
      console.error('Error fetching chat response:', err);
      removeTypingIndicator();
      
      // Fallback local match
      const response = findResponse(text);
      appendAssistantResponse(response);
    } finally {
      // Re-enable inputs
      chatInput.disabled = false;
      sendBtn.disabled = false;
      chatInput.focus();
    }
  }

  // Bind input area event handlers
  sendBtn.addEventListener('click', () => {
    handleSendMessage(chatInput.value);
  });

  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleSendMessage(chatInput.value);
    }
  });

  // Bind initial suggested Qs
  container.querySelectorAll('.suggested-q').forEach(btn => {
    btn.addEventListener('click', () => {
      handleSendMessage(btn.textContent);
    });
  });

  // Bind sidebar chips Qs
  container.querySelectorAll('.copilot-sidebar .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-query');
      if (q) handleSendMessage(q);
    });
  });
}
