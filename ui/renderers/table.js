export function render(output) {
  const d = (output && output.data) || {};
  const rows = d.rows || d.table || [];
  if (!rows.length) return `<div class="result-container table-result"><h3>Table</h3><p>Aucune donnée</p></div>`;
  const cols = Object.keys(rows[0]);
  return `
    <div class="result-container table-result">
      <h3>🔢 Tableau</h3>
      <table>
        <thead><tr>${cols.map(c=>`<th>${c}</th>`).join('')}</tr></thead>
        <tbody>
          ${rows.map(r=>`<tr>${cols.map(c=>`<td>${r[c] ?? ''}</td>`).join('')}</tr>`).join('')}
        </tbody>
      </table>
    </div>
  `;
}
