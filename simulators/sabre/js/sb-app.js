function sbClearTerminal() {
  const term = document.getElementById('termArea');
  if (term) {
    term.innerHTML = '';
  }
  const cmdInput = document.getElementById('cmdInput');
  if (cmdInput) {
    cmdInput.value = '';
    cmdInput.focus();
  }
}
window.sbClearTerminal = sbClearTerminal;

/* =========================================================================
   SABRE TRAINING SIMULATOR — UI INIT / SHELL WIRING
   Independent educational tool — no affiliation with Sabre Corporation.
   ========================================================================= */

let panelOpen = true;
let sbCurrentPanelView = 'summary';
function togglePanel() {
  panelOpen = !panelOpen;
  document.getElementById('sidePanel').classList.toggle('collapsed', !panelOpen);
}

const SB_WORKFLOW_ITEMS = [
  'Documents And Messaging',
  'Passenger Contact & Travel Documents',
  'Queue Place',
  'Generic Seat Request',
  'Issue Ticket/EMD',
  'Air Shop And Change',
  'Exchange Ticket',
  'Cancel Ticket/EMD',
  'Refund Ticket',
  'NDC Fulfill Order',
  'Extended Sales Report',
  'Unused Ticket Report',
  'CO2 Remarks'
];

function sbPanelEscape(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function sbShowPanelView(view) {
  sbCurrentPanelView = view;
  document.querySelectorAll('.panel-menu-item[data-panel-view]').forEach(item => {
    item.classList.toggle('active', item.dataset.panelView === view);
  });
  sbRefreshPanelView();
}

function sbRefreshPanelView() {
  const content = document.getElementById('panelViewContent');
  if (!content) return;
  if (sbCurrentPanelView === 'workflows') {
    content.innerHTML = `<div class="panel-view-heading">Workflows</div>${SB_WORKFLOW_ITEMS.map((label, index) =>
      index === 0
        ? `<button type="button" class="panel-workflow-row" onclick="sbOpenDocumentsModal()"><span class="ic">⦿</span>${label}</button>`
        : index === 1
          ? `<button type="button" class="panel-workflow-row" onclick="sbOpenCommandHelper()"><span class="ic">⦿</span>${label}</button>`
        : index === 7
          ? `<button type="button" class="panel-workflow-row" onclick="sbPrepareWorkflowCommand('WV2')"><span class="ic">⦿</span>${label}</button>`
        : `<div class="panel-workflow-row disabled" aria-disabled="true"><span class="ic">⦿</span>${label}</div>`
    ).join('')}`;
    return;
  }
  if (sbCurrentPanelView !== 'summary') {
    const title = sbCurrentPanelView === 'profiles' ? 'Profiles' : 'Applications';
    content.innerHTML = `<div class="panel-view-heading">${title}</div><div class="panel-summary-body">No ${title.toLowerCase()} are available in this training workspace.</div>`;
    return;
  }

  const passengers = sbState.names || [];
  const segments = (sbState.booked || []).filter(segment => segment.fn !== 'ARNK');
  const tickets = sbState.ticketNumbers || [];
  const paxRows = passengers.length
    ? passengers.map((pax, index) => {
      const age = pax.age ? ` · AGE ${pax.age} ${pax.paxType === 'INF' ? 'MONTHS' : 'YEARS'}` : '';
      return `<div class="panel-summary-row">${index + 1}.1 ${sbPanelEscape(pax.raw || [pax.surname, pax.first, pax.title].filter(Boolean).join(' '))} (${sbPanelEscape(pax.paxType || 'ADT')}${sbPanelEscape(age)})</div>`;
    }).join('')
    : '<div class="panel-summary-row">No travelers in the active PNR.</div>';
  const airRows = segments.length
    ? segments.map((segment, index) => `<div class="panel-summary-row">${index + 1}. ${sbPanelEscape(segment.dep || '---')} ${sbPanelEscape(segment.arr || '---')} ${sbPanelEscape(segment.date || '')} · ${sbPanelEscape(segment.al || '')} ${sbPanelEscape(segment.fn || '')}${sbPanelEscape(segment.cls || '')} · ${sbPanelEscape(segment.status || 'SS1')}</div>`).join('')
    : '<div class="panel-summary-row">No air segments in the active PNR.</div>';
  const ticketRows = tickets.length
    ? tickets.map((ticket, index) => {
      const status = (sbState.voidedTicketNumbers || []).includes(ticket) ? ' (VOIDED)' : '';
      return `<div class="panel-summary-row">${index + 1}. ${sbPanelEscape(ticket)}${status}</div>`;
    }).join('')
    : '<div class="panel-summary-row">No tickets issued.</div>';
  content.innerHTML = `<div class="panel-view-heading">Trip Summary</div>
    <details class="panel-summary-group" open><summary>Travelers (${passengers.length})</summary><div class="panel-summary-body">${paxRows}</div></details>
    <details class="panel-summary-group" open><summary>Air (${segments.length})</summary><div class="panel-summary-body">${airRows}</div></details>
    <details class="panel-summary-group"><summary>Hotel (0)</summary><div class="panel-summary-body">No hotel segments.</div></details>
    <details class="panel-summary-group"><summary>Car (0)</summary><div class="panel-summary-body">No car segments.</div></details>
    <details class="panel-summary-group"><summary>Tickets (${tickets.length})</summary><div class="panel-summary-body">${ticketRows}</div></details>
    <details class="panel-summary-group"><summary>Seats (0)</summary><div class="panel-summary-body">No seat assignments.</div></details>`;
}

function sbPrepareWorkflowCommand(command) {
  const input = document.getElementById('cmdInput');
  if (!input) return;
  input.value = command;
  input.focus();
  const status = document.getElementById('panelViewContent');
  if (status) {
    const note = document.createElement('div');
    note.className = 'panel-summary-body';
    note.textContent = `Command ready: ${command}. Check *T first and send the command to void the ticket on line 2.`;
    status.appendChild(note);
  }
}

function sbDocumentType() {
  return document.querySelector('input[name="sbDocumentType"]:checked')?.value || 'itinerary';
}

function sbOpenDocumentsModal() {
  const modal = document.getElementById('sbDocumentsModal');
  if (!modal) return;
  const status = document.getElementById('sbDocStatus');
  if (status) status.textContent = '';
  try {
    const saved = JSON.parse(localStorage.getItem('sb_document_messaging_options') || 'null');
    if (saved) {
      const type = Array.from(document.querySelectorAll('input[name="sbDocumentType"]'))
        .find(option => option.value === saved.type);
      if (type) type.checked = true;
      document.getElementById('sbDocHideClass').checked = Boolean(saved.hideClass);
      document.getElementById('sbDocIncludeSender').checked = Boolean(saved.includeSender);
      const list = document.getElementById('sbDocRecipientList');
      while (list.children.length > 1) list.lastElementChild.remove();
      (saved.recipients || []).slice(1).forEach(() => sbAddDocumentRecipient());
      const first = document.querySelector('#sbDocRecipientList .sb-doc-recipient-type');
      if (first) first.value = saved.recipients?.[0]?.type || 'To';
      const firstEmail = document.querySelector('#sbDocRecipientList .sb-doc-email');
      if (firstEmail) firstEmail.value = saved.recipients?.[0]?.email || '';
      const firstNote = document.querySelector('#sbDocRecipientList .sb-doc-note');
      if (firstNote) firstNote.value = saved.recipients?.[0]?.note || '';
      const firstLanguage = document.querySelector('#sbDocRecipientList .sb-doc-language');
      if (firstLanguage) firstLanguage.value = saved.recipients?.[0]?.language || 'English';
      Array.from(list.querySelectorAll('.sb-doc-recipient')).slice(1).forEach((row, index) => {
        const recipient = saved.recipients[index + 1] || {};
        row.querySelector('.sb-doc-recipient-type').value = recipient.type || 'To';
        row.querySelector('.sb-doc-email').value = recipient.email || '';
        row.querySelector('.sb-doc-note').value = recipient.note || '';
        row.querySelector('.sb-doc-language').value = recipient.language || 'English';
      });
    }
  } catch (error) {
    if (status) status.textContent = `Could not load saved document preferences: ${error.message}`;
  }
  modal.classList.add('open');
}

function sbCloseDocumentsModal() {
  document.getElementById('sbDocumentsModal')?.classList.remove('open');
}

function sbAddDocumentRecipient() {
  const list = document.getElementById('sbDocRecipientList');
  const first = list?.firstElementChild;
  if (!list || !first) return;
  const row = first.cloneNode(true);
  row.querySelector('.sb-doc-email').value = '';
  row.querySelector('.sb-doc-note').value = '';
  const add = row.querySelector('.sb-doc-add');
  add.textContent = '−';
  add.setAttribute('aria-label', 'Remove recipient');
  add.onclick = () => row.remove();
  list.appendChild(row);
}

function sbGetDocumentRecipients() {
  return Array.from(document.querySelectorAll('#sbDocRecipientList .sb-doc-recipient')).map(row => ({
    type: row.querySelector('.sb-doc-recipient-type')?.value || 'To',
    email: row.querySelector('.sb-doc-email')?.value.trim() || '',
    note: row.querySelector('.sb-doc-note')?.value.trim() || '',
    language: row.querySelector('.sb-doc-language')?.value || 'English'
  })).filter(recipient => recipient.email);
}

function sbSaveDocumentSelections() {
  const status = document.getElementById('sbDocStatus');
  const settings = {
    type: sbDocumentType(),
    hideClass: document.getElementById('sbDocHideClass')?.checked || false,
    includeSender: document.getElementById('sbDocIncludeSender')?.checked || false,
    recipients: sbGetDocumentRecipients()
  };
  try {
    localStorage.setItem('sb_document_messaging_options', JSON.stringify(settings));
    if (status) status.textContent = 'Document and recipient selections saved on this device.';
    return true;
  } catch (error) {
    if (status) status.textContent = `Could not save selections: ${error.message}`;
    return false;
  }
}

function sbSaveDocumentSelectionsAndEnd() {
  if (!sbSaveDocumentSelections()) return;
  const input = document.getElementById('cmdInput');
  if (!input || typeof sendCmd !== 'function') {
    const status = document.getElementById('sbDocStatus');
    if (status) status.textContent = 'Selections saved, but the ER command is not available.';
    return;
  }
  sbCloseDocumentsModal();
  input.value = 'ER';
  sendCmd();
}

function sbDocumentSummary() {
  const names = (sbState.names || []).map(pax => pax.raw || pax.surname || 'PASSENGER').join('\n') || 'PASSENGER';
  const route = (sbState.booked || []).filter(segment => segment.fn !== 'ARNK')
    .map(segment => `${segment.al || ''} ${segment.fn || ''}${segment.cls || ''} ${segment.date || ''} ${segment.dep || '---'}-${segment.arr || '---'}`)
    .join('\n') || 'No itinerary recorded';
  const fare = sbState.fareQuote
    ? `\nTotal: ${sbState.fareQuote.currency || 'BDT'} ${sbState.fareQuote.total}`
    : '';
  const ticket = sbState.eticketNumber ? `\nTicket: ${sbState.eticketNumber}` : '\nTicket: Not issued (preview)';
  return `Document: ${sbDocumentType()}\nPNR: ${sbState.locator || 'Not saved'}\nPassenger(s):\n${names}\nItinerary:\n${route}${fare}${ticket}`;
}

function sbPreviewDocument() {
  if (!sbState.names?.length || !(sbState.booked || []).some(segment => segment.fn !== 'ARNK')) {
    const status = document.getElementById('sbDocStatus');
    if (status) status.textContent = 'Add a passenger and air segment before previewing a document.';
    return;
  }
  const type = sbDocumentType();
  const title = { itinerary: 'Itinerary Receipt', eticket: 'Electronic Ticket Receipt', embedded: 'Embedded eTicket Receipt', invoice: 'Electronic Invoice' }[type];
  const hideClass = document.getElementById('sbDocHideClass')?.checked || false;
  sbSaveDocumentSelections();
  sbCloseDocumentsModal();
  openSabreTicketModal(undefined, title, hideClass);
}

function sbEmailDocument() {
  const recipients = sbGetDocumentRecipients();
  const status = document.getElementById('sbDocStatus');
  const toRecipients = recipients.filter(recipient => recipient.type === 'To');
  if (!toRecipients.length || recipients.some(recipient => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient.email))) {
    if (status) status.textContent = 'Enter at least one valid To email address. CC and BCC are optional.';
    document.getElementById('sbDocumentsModal')?.classList.add('open');
    return;
  }
  const group = type => recipients.filter(recipient => recipient.type === type).map(recipient => recipient.email).join(',');
  const to = group('To');
  const query = new URLSearchParams({
    subject: `GDS Training Hub ${sbDocumentType()}${sbState.locator ? ` - ${sbState.locator}` : ''}`,
    body: sbDocumentSummary()
  });
  const cc = group('CC');
  const bcc = group('BCC');
  if (cc) query.set('cc', cc);
  if (bcc) query.set('bcc', bcc);
  const notes = recipients.filter(recipient => recipient.note).map(recipient => `${recipient.type}: ${recipient.note}`).join('\n');
  if (notes) query.set('body', `${sbDocumentSummary()}\n\n${notes}`);
  if (document.getElementById('sbDocIncludeSender')?.checked) query.set('body', `${query.get('body')}\n\nFrom: GDS Training Hub`);
  const emailStatus = document.getElementById('sbDocStatus');
  if (emailStatus) emailStatus.textContent = 'Opening a pre-filled email draft in your default mail application. The email is not sent by this simulator.';
  window.open(`mailto:${encodeURIComponent(to)}?${query.toString()}`, '_blank', 'noopener');
}

function selectWs(letter) {
  document.querySelectorAll('.ws-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('ws' + letter)?.classList.add('active');
}

/* ---------------------------------------------------------------------
   COMMAND HELPER POPUP — quick-reference list of every Phase 1 entry,
   opened from the "🪄 Command Helper" button, the F-key bar's "⋮", or
   by typing HELP / ? in the terminal.
--------------------------------------------------------------------- */
const SB_HELP_ENTRIES = [
  { cmd: 'DU*/SPM', desc: 'Display the special meals reference table' },
  { cmd: '120JANDACSIN', desc: 'Availability — enter date and city pair' },
  { cmd: '02Q6', desc: 'Sell two Q-class seats from availability line 6' },
  { cmd: '-TRAINING/ADULT MR', desc: 'Add adult passenger' },
  { cmd: '-TRAINING/CHILD*C08', desc: 'Add child passenger (age 8)' },
  { cmd: '-I/TRAINING/INFANT MSTR*I17', desc: 'Add infant passenger (age 17 months)' },
  { cmd: '3CHLD/15JAN18-2', desc: 'Required child date-of-birth SSR (passenger 2)' },
  { cmd: '3INFT/TRAINING/INFANT MSTR/01MAY25-1.3', desc: 'Required infant date-of-birth SSR (passenger 3)' },
  { cmd: '9AGENCY CONTACT 00000000000', desc: 'Add agency phone/contact remark' },
  { cmd: '7T-', desc: 'Add ticketing arrangement' },
  { cmd: '3CTCM/00000000000-1.1', desc: 'Add passenger mobile contact' },
  { cmd: '3CTCM/01888888888', desc: 'Add a general PNR mobile contact (no passenger association)' },
  { cmd: '3CTCE/PASSENGER//EXAMPLE.COM-1.1', desc: 'Add passenger email contact' },
  { cmd: '3DOCS/P/BD/X00000000/BD/15JAN90/M/25OCT30/TRAINING/ADULT-1.1', desc: 'Add passport/APIS details' },
  { cmd: '3DOCO/BD/V/1209876/BD/12JUN22/AE//12JUN24-1.1', desc: 'Add a passenger visa/travel document (DOCO)' },
  { cmd: '*P3D', desc: 'Display saved DOCS passport and DOCO visa details' },
  { cmd: 'WPA SQ', desc: 'Price the itinerary with Singapore Airlines' },
  { cmd: 'PQ', desc: 'Create a Price Quote record' },
  { cmd: '6SHAKIB', desc: 'Set received-from name before saving' },
  { cmd: 'ER', desc: 'Save and end the PNR' },
  { cmd: 'IR', desc: 'Ignore current work and redisplay saved PNR' },
  { cmd: '*PQ', desc: 'Display the retained Price Quote' },
  { cmd: 'W*BD', desc: 'Open ticket printer work area' },
  { cmd: 'DSIVE8C987', desc: 'Assign the printer ID' },
  { cmd: 'PTR/E8C987', desc: 'Designate printer for ticketing' },
  { cmd: 'WT', desc: 'Issue ticket from the saved price quote using its validating carrier' },
  { cmd: '*T', desc: 'Display the issued ticket' },
  { cmd: 'WETR*2', desc: 'Display the eTicket record on TKT/TIME LIMIT line 2' },
  { cmd: 'WV2', desc: 'Void the ticket on line 2, then verify the TV/*VOID* record with *T' },
  { cmd: 'DQB*', desc: 'List today’s issued tickets; sales history is retained for 30 days' },
];

function sbOpenCommandHelper() {
  const modal = document.getElementById('sbHelpModal');
  const list = document.getElementById('sbHelpList');
  if (!modal || !list) return;
  list.replaceChildren(...SB_HELP_ENTRIES.map(entry => {
    const row = document.createElement('div');
    row.className = 'sb-help-row';
    row.addEventListener('click', () => sbUseHelpCmd(entry.cmd));
    const command = document.createElement('span');
    command.className = 'sb-help-cmd';
    command.textContent = entry.cmd;
    const description = document.createElement('span');
    description.className = 'sb-help-desc';
    description.textContent = entry.desc;
    row.append(command, description);
    return row;
  }));
  modal.classList.add('open');
}
function sbCloseCommandHelper() {
  document.getElementById('sbHelpModal')?.classList.remove('open');
}
function sbUseHelpCmd(cmd) {
  const input = document.getElementById('cmdInput');
  if (input) { input.value = cmd; input.focus(); }
  sbCloseCommandHelper();
}

let sbSelectedHistoryIndex = -1;
function sbOpenHistory() {
  const modal = document.getElementById('sbHistoryModal');
  const list = document.getElementById('sbHistoryList');
  if (!modal || !list) return;
  const entries = sbCommandHistory.slice().reverse();
  sbSelectedHistoryIndex = entries.length ? 0 : -1;
  list.innerHTML = entries.length
    ? entries.map((command, index) => `<button type="button" class="sb-history-row${index === 0 ? ' selected' : ''}" data-index="${index}"><span>⌨</span>${command}</button>`).join('')
    : '<div class="sb-history-empty">NO COMMAND HISTORY</div>';
  list.querySelectorAll('.sb-history-row').forEach(row => row.addEventListener('click', () => {
    sbSelectedHistoryIndex = Number(row.dataset.index);
    list.querySelectorAll('.sb-history-row').forEach(item => item.classList.remove('selected'));
    row.classList.add('selected');
  }));
  modal.classList.add('open');
}
function sbCloseHistory() { document.getElementById('sbHistoryModal')?.classList.remove('open'); }
function sbUseHistory(sendNow) {
  const entries = sbCommandHistory.slice().reverse();
  const command = entries[sbSelectedHistoryIndex];
  if (!command) return;
  const input = document.getElementById('cmdInput');
  input.value = command;
  sbCloseHistory();
  if (sendNow) sendCmd(); else input.focus();
}

document.getElementById('cmdInput').addEventListener('keydown', e => {
  // Sabre keyboard equivalents: +/= is Display (*) and the quote/backslash
  // key immediately left of Enter is Cross of Lorraine (¥), the end-item key.
  if (e.code === 'Equal') {
    e.preventDefault();
    e.target.setRangeText('*', e.target.selectionStart, e.target.selectionEnd, 'end');
    return;
  }
  if (e.code === 'Quote' || e.code === 'Backslash') {
    e.preventDefault();
    e.target.setRangeText('¥', e.target.selectionStart, e.target.selectionEnd, 'end');
    return;
  }
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    sendCmd();
    return;
  }
  if (e.key === 'Enter') sendCmd();
});
document.getElementById('cmdInput').addEventListener('input', e => {
  e.target.value = e.target.value.toUpperCase();
});
document.getElementById('historyBtn').addEventListener('click', sbOpenHistory);

// Capture the Sabre-style Alt+Arrow recall shortcut at window level too.
window.addEventListener('keydown', e => {
  if (!e.altKey) return;
  if (e.key === 'Backspace' || e.code === 'Backspace') {
    e.preventDefault();
    sbClearTerminal();
    return;
  }
  if (e.key === 'ArrowUp') { e.preventDefault(); sbRecallHistory(-1); }
  if (e.key === 'ArrowDown') { e.preventDefault(); sbRecallHistory(1); }
}, true);

/* --- About Us Modal --- */
function sbOpenAboutModal() {
  const m = document.getElementById('sbAboutModal');
  if (m) m.classList.add('open');
}
function sbCloseAboutModal() {
  const m = document.getElementById('sbAboutModal');
  if (m) m.classList.remove('open');
}
window.sbOpenAboutModal = sbOpenAboutModal;
window.sbCloseAboutModal = sbCloseAboutModal;

sbShowPanelView('summary');
