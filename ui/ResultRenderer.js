import { render as renderByType } from './renderers/index.js';
import { escapeHtml } from './renderers/utils.js';

/**
 * Backwards-compatible wrapper used by the UI.
 * Delegates rendering to typed renderer modules in ui/renderers/.
 */
export function renderResult(output) {
  try {
    return renderByType(output);
  } catch (error) {
    console.error('Renderer error for model:', output && output.modelId, 'Output:', output, 'Error:', error);
    const safeModelId = escapeHtml(output && output.modelId);
    const safeErrorMsg = escapeHtml(error && error.message);
    const safeOutputJson = escapeHtml(JSON.stringify(output, null, 2));

    return `
      <div class="result-container fallback">
        <h3>❌ Erreur de Rendu</h3>
        <p><strong>Modèle:</strong> ${safeModelId}</p>
        <p><strong>Erreur:</strong> ${safeErrorMsg}</p>
        <p style="margin-top: 1rem; padding: 0.8rem; background: #fef2f2; border-left: 4px solid #dc2626; border-radius: 6px; font-size: 0.85rem;">
          Vérifiez la console (F12) pour plus de détails sur la structure des données.
        </p>
        <h4>Données Brutes:</h4>
        <pre style="background: #f3f4f6; padding: 1rem; border-radius: 8px; overflow-x: auto; font-size: 0.85rem;">${safeOutputJson}</pre>
      </div>
    `;
  }
}

