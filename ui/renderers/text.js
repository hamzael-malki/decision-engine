import { escapeHtml } from './utils.js';

export function render(output) {
  const d = (output && output.data) || {};
  const summary = d.summary || d.text || d.insights || '';
  if (typeof summary === 'string') {
    return `<div class="result-container text-result"><h3>📝 Résumé</h3><p>${escapeHtml(summary)}</p></div>`;
  }
  // object -> list
  const items = Object.entries(summary || {}).map(([k,v]) => `<div><strong>${escapeHtml(k)}:</strong> ${escapeHtml(v)}</div>`).join('');
  return `<div class="result-container text-result"><h3>📝 Résumé</h3>${items}</div>`;
}

