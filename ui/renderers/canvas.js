export function render(output) {
  const d = (output && output.data) || {};
  const sections = d.sections || d.canvas || d.cells || {};
  // sections may be object with keys
  const keys = Array.isArray(sections) ? sections : Object.keys(sections || {});
  const mk = (k) => {
    const v = Array.isArray(sections) ? sections[k] : sections[k];
    if (!v) return '<div class="cell">—</div>';
    if (Array.isArray(v)) return `<div class="cell"><ul>${v.map(i=>`<li>${i}</li>`).join('')}</ul></div>`;
    return `<div class="cell">${typeof v === 'object' ? JSON.stringify(v) : v}</div>`;
  };
  return `
    <div class="result-container canvas-result">
      <h3>🗺️ Canvas</h3>
      <div class="canvas-grid">
        ${Array.isArray(keys) && keys.length ? keys.map(k => `<div class="canvas-section"><h4>${k}</h4>${mk(k)}</div>`).join('') : '<p>Aucune section</p>'}
      </div>
    </div>
  `;
}
