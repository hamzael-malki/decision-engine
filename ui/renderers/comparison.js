export function render(output) {
  const d = (output && output.data) || {};
  const before = d.before || [];
  const after = d.after || [];
  const mk = (arr) => (Array.isArray(arr) && arr.length ? arr.map(i => `<li>${i}</li>`).join('') : '<li>—</li>');
  return `
    <div class="result-container comparison-result">
      <h3>↔️ Comparaison Avant / Après</h3>
      <div class="comparison-grid">
        <div class="col">
          <h4>Avant</h4>
          <ul>${mk(before)}</ul>
        </div>
        <div class="col">
          <h4>Après</h4>
          <ul>${mk(after)}</ul>
        </div>
      </div>
    </div>
  `;
}
