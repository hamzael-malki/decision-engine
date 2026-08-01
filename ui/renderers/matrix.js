export function render(output) {
  const data = (output && output.data) || {};
  const matrixData = data.matrix || {};
  const dist = data.distribution || {};
  const summary = output.summary || '';
  const recs = data.recommendations || {};
  const q = (arr) => (Array.isArray(arr) ? arr.map(i => `<li>${i}</li>`).join('') : '<li>—</li>');
  const bar = (pct) => `<div class="dist-bar"><div class="fill" style="width:${Math.min(100, Number(pct)||0)}%"></div></div>`;
  return `
    <div class="result-container matrix-result">
      ${summary ? `<p class="summary">${summary}</p>` : ''}
      <div class="distribution-overview">
        ${bar(dist.do_first_pct)}${bar(dist.schedule_pct)}${bar(dist.delegate_pct)}${bar(dist.eliminate_pct)}
      </div>
      <div class="quadrant-grid">
        <div class="quadrant do-first">
          <h4>🔴 Priorité (${dist.do_first_pct || 0}%)</h4>
          <ul>${q(matrixData.do_first)}</ul>
          ${recs.do_first ? `<p class="recommendation">${recs.do_first}</p>` : ''}
        </div>
        <div class="quadrant schedule">
          <h4>🟡 Planifier (${dist.schedule_pct || 0}%)</h4>
          <ul>${q(matrixData.schedule)}</ul>
          ${recs.schedule ? `<p class="recommendation">${recs.schedule}</p>` : ''}
        </div>
        <div class="quadrant delegate">
          <h4>🟢 Déléguer (${dist.delegate_pct || 0}%)</h4>
          <ul>${q(matrixData.delegate)}</ul>
          ${recs.delegate ? `<p class="recommendation">${recs.delegate}</p>` : ''}
        </div>
        <div class="quadrant eliminate">
          <h4>⚪ Éliminer (${dist.eliminate_pct || 0}%)</h4>
          <ul>${q(matrixData.eliminate)}</ul>
          ${recs.eliminate ? `<p class="recommendation">${recs.eliminate}</p>` : ''}
        </div>
      </div>
    </div>
  `;
}
