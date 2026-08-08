import { escapeHtml, formatItem } from './utils.js';

export function render(output) {
  const d = (output && output.data) || {};
  const summary = output.summary ? escapeHtml(output.summary) : '';
  const objective = d.objectif ? escapeHtml(d.objectif) : '';
  const type = d.objectiveType ? escapeHtml(d.objectiveType) : '';
  const questions = d.coachingQuestions || {};
  const actions = d.actionSuggestions || [];
  const recs = d.recommendations || {};

  const mkList = arr => (Array.isArray(arr) && arr.length) ? `<ul>${arr.map(i=>`<li>${formatItem(i)}</li>`).join('')}</ul>` : '<p>Aucune donnée</p>';

  return `
    <div class="result-container list-result">
      ${summary ? `<p class="summary">${summary}</p>` : ''}
      ${objective ? `<p><strong>Objectif:</strong> ${objective}</p>` : ''}
      ${type ? `<p><strong>Type:</strong> ${type}</p>` : ''}

      <div class="grow-sections">
        <div class="grow-section">
          <h4>🎯 Goal (Objectif)</h4>
          ${mkList(questions.goal)}
        </div>
        <div class="grow-section">
          <h4>📍 Reality (Réalité)</h4>
          ${mkList(questions.reality)}
        </div>
        <div class="grow-section">
          <h4>🛣️ Options</h4>
          ${mkList(questions.options)}
        </div>
        <div class="grow-section">
          <h4>⚡ Will (Volonté)</h4>
          ${mkList(questions.will)}
        </div>
      </div>

      ${actions.length ? `<div class="coaching-questions"><h4>💡 Actions Suggérées</h4>${mkList(actions)}</div>` : ''}
      ${recs ? `<div class="recommendations">${Object.entries(recs).map(([k,v])=>`<div><strong>${escapeHtml(k)}:</strong> ${escapeHtml(v)}</div>`).join('')}</div>` : ''}
    </div>
  `;
}

