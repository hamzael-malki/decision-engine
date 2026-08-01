export function render(output) {
  const data = (output && output.data) || {};
  const summary = output.summary || '';
  const recs = data.recommendations || {};
  const dist = data.distribution || data.counts || {};

  const qHtml = (arr) => (Array.isArray(arr) ? arr.map(i => `<li>${i}</li>`).join('') : '<li>—</li>');
  const bar = (pct) => `<div class="dist-bar"><div class="fill" style="width:${Math.min(100, Number(pct)||0)}%"></div></div>`;

  // If SWOT-style analysis provided, render the 4 SWOT quadrants
  if (data.analysis) {
    const a = data.analysis;
    const labels = { strengths: '💪 Forces', weaknesses: '⚠️ Faiblesses', opportunities: '🚀 Opportunités', threats: '⚡ Menaces' };
    return `
      <div class="result-container matrix-result">
        ${summary ? `<p class="summary">${summary}</p>` : ''}
        <div class="quadrant-grid">
          ${['strengths','weaknesses','opportunities','threats'].map(key => `
            <div class="swot-box ${key}">
              <h4>${labels[key]} (${(data.counts && data.counts[key]) || (a[key] && a[key].length) || 0})</h4>
              <ul>${qHtml(a[key])}</ul>
              ${recs && recs[key] ? `<p class="recommendation">${recs[key]}</p>` : ''}
            </div>
          `).join('')}
        </div>
        ${data.strategies ? `<div class="strategy-matrix"><h4>📈 Matrice Stratégique</h4><div class="strategies">${Object.entries(data.strategies).map(([k,v])=>`<div class="strategy"><strong>${k}:</strong> ${v}</div>`).join('')}</div></div>` : ''}
        ${data.recommendations && data.recommendations.next_steps ? `<div class="recommendations"><h4>Prochaines étapes</h4><ul>${data.recommendations.next_steps.map(s=>`<li>${s}</li>`).join('')}</ul></div>` : ''}
      </div>
    `;
  }

  // Generic matrix: iterate over provided matrix keys
  const matrixData = data.matrix || {};
  const entries = Object.entries(matrixData);
  if (entries.length === 0) {
    return `
      <div class="result-container matrix-result">
        ${summary ? `<p class="summary">${summary}</p>` : ''}
        <p>Aucune donnée de matrice disponible</p>
      </div>
    `;
  }

  return `
    <div class="result-container matrix-result">
      ${summary ? `<p class="summary">${summary}</p>` : ''}
      <div class="distribution-overview">
        ${entries.map(([k]) => bar(dist[k] || dist[`${k}_pct`])).join('')}
      </div>
      <div class="quadrant-grid">
        ${entries.map(([key, value]) => {
          const title = (data.quadrantLabels && data.quadrantLabels[key]) || key.replace(/[_-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
          const pct = dist[key] || dist[`${key}_pct`] || 0;
          return `
            <div class="quadrant ${key}">
              <h4>${title} (${pct}%)</h4>
              <ul>${qHtml(value)}</ul>
              ${recs && recs[key] ? `<p class="recommendation">${recs[key]}</p>` : ''}
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}
