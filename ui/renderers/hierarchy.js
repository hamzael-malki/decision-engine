import { escapeHtml } from './utils.js';

export function render(output) {
  const d = (output && output.data) || {};
  const levels = d.levels || d.pyramid || [];
  if (!levels || !levels.length) {
    return `<div class="result-container hierarchy-result"><h3>Hierarchy</h3><p>Aucune donnée</p></div>`;
  }
  return `
    <div class="result-container hierarchy-result">
      <h3>🔺 Hiérarchie</h3>
      <ol class="hierarchy-list">
        ${levels.map(l => `<li><strong>${escapeHtml(l.title || l.name || '')}</strong>${l.desc ? ` — ${escapeHtml(l.desc)}` : ''}</li>`).join('')}
      </ol>
    </div>
  `;
}

