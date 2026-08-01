export function render(output) {
  const d = (output && output.data) || {};
  const items = d.items || d.list || d.actionSuggestions || [];
  return `
    <div class="result-container list-result">
      <h3>🗂️ Liste</h3>
      <ul>
        ${Array.isArray(items) && items.length ? items.map(i => `<li>${i}</li>`).join('') : '<li>Pas d\'éléments</li>'}
      </ul>
    </div>
  `;
}
