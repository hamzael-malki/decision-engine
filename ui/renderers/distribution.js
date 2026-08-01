export function render(output) {
  const d = (output && output.data) || {};
  const values = d.values || d.distribution || d.chart || {};
  // values can be object {label: pct}
  const entries = Array.isArray(values) ? values : Object.entries(values || {});
  if (!entries.length) return `<div class="result-container distribution-result"><h3>Distribution</h3><p>Aucune donnée</p></div>`;
  const rows = entries.map(([k,v]) => `<div class="dist-row"><div class="label">${k}</div><div class="bar"><div class="bar-fill" style="width:${Math.min(100, Number(v) || 0)}%"></div></div><div class="val">${v}%</div></div>`).join('');
  return `
    <div class="result-container distribution-result">
      <h3>📊 Distribution</h3>
      <div class="distribution-list">${rows}</div>
    </div>
  `;
}
