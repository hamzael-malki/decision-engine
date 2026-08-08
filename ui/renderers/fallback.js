import { escapeHtml } from './utils.js';

export function render(output) {
  return `
    <div class="result-container fallback">
      <h3>📋 Résultat (Brut)</h3>
      <pre>${escapeHtml(JSON.stringify(output, null, 2))}</pre>
    </div>
  `;
}

