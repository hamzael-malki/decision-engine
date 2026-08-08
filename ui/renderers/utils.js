/**
 * Utility functions for renderers (XSS escaping and item formatting)
 */

export function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  if (typeof str === 'object') {
    str = JSON.stringify(str);
  }
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function formatItem(item) {
  if (item === null || item === undefined) return '';
  if (typeof item === 'object') {
    const name = item.name || item.label || item.title || item.text || item.tache || '';
    if (name) {
      const extra = (item.marketShare !== undefined && item.growth !== undefined)
        ? ` (${item.marketShare}% / ${item.growth}%)`
        : '';
      return escapeHtml(`${name}${extra}`);
    }
    return escapeHtml(JSON.stringify(item));
  }
  return escapeHtml(String(item));
}
