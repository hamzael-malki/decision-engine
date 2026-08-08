import { escapeHtml } from './utils.js';

export function render(output) {
  const d = (output && output.data) || {};
  const rawRows = d.rows || d.table || [];
  const rows = (Array.isArray(rawRows) ? rawRows : []).filter(r => r && typeof r === 'object');
  if (!rows.length) return `<div class="result-container table-result"><h3>Table</h3><p>Aucune donnée</p></div>`;
  const cols = Object.keys(rows[0]);
  return `
    <div class="result-container table-result">
      <h3>🔢 Tableau</h3>
      <table>
        <thead><tr>${cols.map(c=>`<th>${escapeHtml(c)}</th>`).join('')}</tr></thead>
        <tbody>
          ${rows.map(r=>`<tr>${cols.map(c=>`<td>${escapeHtml(r?.[c] ?? '')}</td>`).join('')}</tr>`).join('')}
        </tbody>
      </table>
    </div>
  `;
}

