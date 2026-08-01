/**
 * ResultRenderer - Formattage intelligent des résultats par modèle
 * Chaque modèle a un renderer HTML spécifique
 */

export const ResultRenderer = {
  eisenhower: (output) => {
    const { data } = output;
    return `
      <div class="result-container eisenhower-result">
        <h3>📊 Matrice Eisenhower</h3>
        <div class="quadrant-grid">
          <div class="quadrant do-first">
            <h4>🔴 À faire en priorité</h4>
            <p class="percentage">${data.distribution.do_first_pct}%</p>
            <ul>${data.matrix.do_first.map(t => `<li>${t}</li>`).join('')}</ul>
          </div>
          <div class="quadrant schedule">
            <h4>🟡 À planifier</h4>
            <p class="percentage">${data.distribution.schedule_pct}%</p>
            <ul>${data.matrix.schedule.map(t => `<li>${t}</li>`).join('')}</ul>
          </div>
          <div class="quadrant delegate">
            <h4>🟢 À déléguer</h4>
            <p class="percentage">${data.distribution.delegate_pct}%</p>
            <ul>${data.matrix.delegate.map(t => `<li>${t}</li>`).join('')}</ul>
          </div>
          <div class="quadrant eliminate">
            <h4>⚪ À éliminer</h4>
            <p class="percentage">${data.distribution.eliminate_pct}%</p>
            <ul>${data.matrix.eliminate.map(t => `<li>${t}</li>`).join('')}</ul>
          </div>
        </div>
      </div>
    `;
  },

  swot: (output) => {
    const { data } = output;
    const analysis = data.analysis || {};
    const strategic = data.strategies || {};
    return `
      <div class="result-container swot-result">
        <h3>🎯 Analyse SWOT</h3>
        <div class="swot-grid">
          <div class="swot-box strength">
            <h4>💪 Forces (${data.counts?.strengths || 0})</h4>
            <ul>${(analysis.strengths || []).length > 0 ? analysis.strengths.map(s => `<li>${s}</li>`).join('') : '<li>À remplir</li>'}</ul>
          </div>
          <div class="swot-box weakness">
            <h4>⚠️ Faiblesses (${data.counts?.weaknesses || 0})</h4>
            <ul>${(analysis.weaknesses || []).length > 0 ? analysis.weaknesses.map(w => `<li>${w}</li>`).join('') : '<li>À remplir</li>'}</ul>
          </div>
          <div class="swot-box opportunity">
            <h4>🚀 Opportunités (${data.counts?.opportunities || 0})</h4>
            <ul>${(analysis.opportunities || []).length > 0 ? analysis.opportunities.map(o => `<li>${o}</li>`).join('') : '<li>À remplir</li>'}</ul>
          </div>
          <div class="swot-box threat">
            <h4>⚡ Menaces (${data.counts?.threats || 0})</h4>
            <ul>${(analysis.threats || []).length > 0 ? analysis.threats.map(t => `<li>${t}</li>`).join('') : '<li>À remplir</li>'}</ul>
          </div>
        </div>
        <div class="strategy-matrix">
          <h4>📈 Matrice Stratégique</h4>
          <div class="strategies">
            ${strategic.SO ? `<div class="strategy"><strong>SO:</strong> ${strategic.SO}</div>` : ''}
            ${strategic.WO ? `<div class="strategy"><strong>WO:</strong> ${strategic.WO}</div>` : ''}
            ${strategic.ST ? `<div class="strategy"><strong>ST:</strong> ${strategic.ST}</div>` : ''}
            ${strategic.WT ? `<div class="strategy"><strong>WT:</strong> ${strategic.WT}</div>` : ''}
          </div>
        </div>
        ${data.recommendations ? `<p style="margin-top: 1rem; padding: 0.8rem; background: #f0f4f8; border-radius: 6px;"><strong>💡 Conseil:</strong> ${data.recommendations.focus}</p>` : ''}
      </div>
    `;
  },

  'empathy-map': (output) => {
    const { data } = output;
    const emotions = data.emotions || [];
    const needs = data.needs || [];
    const frustrations = data.frustrations || [];
    const insights = data.insights || {};
    return `
      <div class="result-container empathy-result">
        <h3>❤️ Carte d'Empathie</h3>
        <div class="empathy-grid">
          <div class="empathy-section thinks">
            <h4>💭 Pense</h4>
            <p>${data.personDescription || 'N/A'}</p>
          </div>
          <div class="empathy-section feels">
            <h4>😊 Ressent (Émotions)</h4>
            <ul>${emotions.length > 0 ? emotions.map(e => `<li>${e}</li>`).join('') : '<li>À clarifier</li>'}</ul>
          </div>
          <div class="empathy-section needs">
            <h4>🤝 Besoins</h4>
            <ul>${needs.length > 0 ? needs.map(n => `<li>${n}</li>`).join('') : '<li>À explorer</li>'}</ul>
          </div>
          <div class="empathy-section frustrations">
            <h4>😤 Frustrations</h4>
            <ul>${frustrations.length > 0 ? frustrations.map(f => `<li>${f}</li>`).join('') : '<li>À identifier</li>'}</ul>
          </div>
        </div>
        ${insights.primaryEmotion ? `<div class="insights"><strong>Émotion Principale:</strong> ${insights.primaryEmotion} | <strong>Besoin Principal:</strong> ${insights.mainNeed} | <strong>Frustration Clé:</strong> ${insights.keyFrustration}</div>` : ''}
      </div>
    `;
  },

  grow: (output) => {
    const { data } = output;
    const questions = data.coachingQuestions || {};
    const actions = data.actionSuggestions || [];
    return `
      <div class="result-container grow-result">
        <h3>🌱 Modèle GROW</h3>
        <div class="grow-header" style="background: #eff6ff; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid #3b82f6;">
          <p><strong>Objectif:</strong> ${data.objectif || 'N/A'}</p>
          <p><strong>Type:</strong> ${data.objectiveType || 'Générique'}</p>
        </div>
        <div class="grow-sections">
          <div class="grow-section">
            <h4>🎯 Goal (Objectif)</h4>
            <ul>${(questions.goal || []).length > 0 ? questions.goal.map(q => `<li>${q}</li>`).join('') : '<li>Questions non disponibles</li>'}</ul>
          </div>
          <div class="grow-section">
            <h4>📍 Reality (Réalité)</h4>
            <ul>${(questions.reality || []).length > 0 ? questions.reality.map(q => `<li>${q}</li>`).join('') : '<li>Questions non disponibles</li>'}</ul>
          </div>
          <div class="grow-section">
            <h4>🛣️ Options</h4>
            <ul>${(questions.options || []).length > 0 ? questions.options.map(q => `<li>${q}</li>`).join('') : '<li>Questions non disponibles</li>'}</ul>
          </div>
          <div class="grow-section">
            <h4>⚡ Will (Volonté)</h4>
            <ul>${(questions.will || []).length > 0 ? questions.will.map(q => `<li>${q}</li>`).join('') : '<li>Questions non disponibles</li>'}</ul>
          </div>
        </div>
        ${actions.length > 0 ? `
        <div class="coaching-questions">
          <h4>💡 Actions Suggérées</h4>
          <ul>${actions.map(a => `<li>${a}</li>`).join('')}</ul>
        </div>
        ` : ''}
      </div>
    `;
  },

  fallback: (output) => {
    return `
      <div class="result-container fallback">
        <h3>📋 Résultat (Format Générique)</h3>
        <pre>${JSON.stringify(output, null, 2)}</pre>
      </div>
    `;
  }
};

import { render as renderByType } from './renderers/index.js';

/**
 * Backwards-compatible wrapper used by the UI.
 * Delegates rendering to typed renderer modules in ui/renderers/.
 */
export function renderResult(output) {
  try {
    return renderByType(output);
  } catch (error) {
    console.error('Renderer error for model:', output && output.modelId, 'Output:', output, 'Error:', error);
    return `
      <div class="result-container fallback">
        <h3>❌ Erreur de Rendu</h3>
        <p><strong>Modèle:</strong> ${output && output.modelId}</p>
        <p><strong>Erreur:</strong> ${error && error.message}</p>
        <p style="margin-top: 1rem; padding: 0.8rem; background: #fef2f2; border-left: 4px solid #dc2626; border-radius: 6px; font-size: 0.85rem;">
          Vérifiez la console (F12) pour plus de détails sur la structure des données.
        </p>
        <h4>Données Brutes:</h4>
        <pre style="background: #f3f4f6; padding: 1rem; border-radius: 8px; overflow-x: auto; font-size: 0.85rem;">${JSON.stringify(output, null, 2)}</pre>
      </div>
    `;
  }
}
