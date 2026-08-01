export function render(output) {
  const data = (output && output.data) || {};
  const matrixData = data.matrix || {};
  const dist = data.distribution || {};
  const q = (arr) => (Array.isArray(arr) ? arr.map(i => `<li>${i}</li>`).join('') : '<li>—</li>');
  return `
    <div class="result-container matrix-result">
      <h3>📊 Matrice</h3>
      <div class="quadrant-grid">
        <div class="quadrant do-first">
          <h4>🔴 Priorité</h4>
          <p class="percentage">${dist.do_first_pct || ''}</p>
          <ul>${q(matrixData.do_first)}</ul>
        </div>
        <div class="quadrant schedule">
          <h4>🟡 Planifier</h4>
          <p class="percentage">${dist.schedule_pct || ''}</p>
          <ul>${q(matrixData.schedule)}</ul>
        </div>
        <div class="quadrant delegate">
          <h4>🟢 Déléguer</h4>
          <p class="percentage">${dist.delegate_pct || ''}</p>
          <ul>${q(matrixData.delegate)}</ul>
        </div>
        <div class="quadrant eliminate">
          <h4>⚪ Éliminer</h4>
          <p class="percentage">${dist.eliminate_pct || ''}</p>
          <ul>${q(matrixData.eliminate)}</ul>
        </div>
      </div>
    </div>
  `;
}
