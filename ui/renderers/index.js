// Registry and heuristic for mapping outputs to renderer modules
import * as matrix from './matrix.js';
import * as hierarchy from './hierarchy.js';
import * as list from './list.js';
import * as comparison from './comparison.js';
import * as canvas from './canvas.js';
import * as distribution from './distribution.js';
import * as text from './text.js';
import * as table from './table.js';
import * as fallback from './fallback.js';

const MODEL_MAP = {
  eisenhower: matrix,
  swot: matrix,
  'empathy-map': canvas,
  grow: list,
  // add modelId -> renderer mappings as needed
};

export function detectRenderer(output) {
  if (!output || !output.data) return fallback;
  // explicit modelId mapping first
  if (output.modelId && MODEL_MAP[output.modelId]) return MODEL_MAP[output.modelId];
  const d = output.data;
  // shape-based heuristics
  if (d.matrix || d.quadrants) return matrix;
  if (d.sections || d.canvas || d.personDescription) return canvas;
  if (d.rows || d.table) return table;
  if (d.distribution || d.chart || d.values) return distribution;
  if (d.items || Array.isArray(d.list) || d.entries) return list;
  if (d.before || d.after) return comparison;
  if (d.pyramid || d.levels || d.hierarchy) return hierarchy;
  if (typeof d.text === 'string' || d.summary) return text;
  return fallback;
}

export function render(output) {
  try {
    const renderer = detectRenderer(output);
    return renderer.render(output);
  } catch (err) {
    console.error('Renderer registry error', err, output);
    return fallback.render(output);
  }
}
