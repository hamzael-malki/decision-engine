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
  bcg: distribution,
  // add modelId -> renderer mappings as needed
};

const RESULT_TYPE_MAP = {
  matrix,
  canvas,
  list,
  comparison,
  distribution,
  text,
  table,
  hierarchy
};

export function detectRenderer(output) {
  if (!output || !output.data) return fallback;
  // 1) explicit presentation.resultType preferred (models should expose a presentation block)
  const presType = output.presentation && output.presentation.resultType;
  if (presType && RESULT_TYPE_MAP[presType]) return RESULT_TYPE_MAP[presType];
  // 2) legacy top-level resultType
  if (output.resultType && RESULT_TYPE_MAP[output.resultType]) return RESULT_TYPE_MAP[output.resultType];
  // 3) explicit modelId mapping
  if (output.modelId && MODEL_MAP[output.modelId]) return MODEL_MAP[output.modelId];
  const d = output.data;
  // 4) shape-based heuristics (fallback)
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
