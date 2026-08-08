import { escapeHtml, formatItem } from './utils.js';

export function render(output) {
  const d = (output && output.data) || {};
  const summary = output.summary ? escapeHtml(output.summary) : '';
  const person = d.personDescription ? escapeHtml(d.personDescription) : '';
  const emotions = d.emotions || [];
  const needs = d.needs || [];
  const frustrations = d.frustrations || [];
  const insights = d.insights || {};
  const recs = d.recommendations || {};

  const section = (title, content) => `<div class="empathy-section"><h4>${title}</h4>${content}</div>`;

  return `
    <div class="result-container canvas-result">
      ${summary ? `<p class="summary">${summary}</p>` : ''}
      <div class="empathy-grid">
        ${section('💭 Pense', `<p>${person || 'N/A'}</p>`) }
        ${section('😊 Ressent (Émotions)', `<ul>${emotions.map(e=>`<li>${formatItem(e)}</li>`).join('')}</ul>`)}
        ${section('🤝 Besoins', `<ul>${needs.map(n=>`<li>${formatItem(n)}</li>`).join('') || '<li>À explorer</li>'}</ul>`)}
        ${section('😤 Frustrations', `<ul>${frustrations.map(f=>`<li>${formatItem(f)}</li>`).join('') || '<li>À identifier</li>'}</ul>`)}
      </div>
      ${insights && (insights.primaryEmotion || insights.mainNeed) ? `<div class="insights"><strong>Insight:</strong> ${escapeHtml(insights.primaryEmotion)} — ${escapeHtml(insights.mainNeed)}</div>` : ''}
      ${recs ? `<div class="recommendations">${Object.entries(recs).map(([k,v])=>`<div><strong>${escapeHtml(k)}:</strong> ${escapeHtml(v)}</div>`).join('')}</div>` : ''}
    </div>
  `;
}

