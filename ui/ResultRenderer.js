import { render as renderByType } from './renderers/index.js';

/**
 * Backwards-compatible wrapper used by the UI.
 * Delegates rendering to typed renderer modules in ui/renderers/.
 */
export function renderResult(output) {
  try {
    return renderByType(output);
  } catch (error) {
    console.error('Renderer error for model:', output && output.modelId, 'Output:', output, 'Error:', error);
    return `
      <div class="result-container fallback">
        <h3>❌ Erreur de Rendu</h3>
        <p><strong>Modèle:</strong> ${output && output.modelId}</p>
        <p><strong>Erreur:</strong> ${error && error.message}</p>
        <p style="margin-top: 1rem; padding: 0.8rem; background: #fef2f2; border-left: 4px solid #dc2626; border-radius: 6px; font-size: 0.85rem;">
          Vérifiez la console (F12) pour plus de détails sur la structure des données.
        </p>
        <h4>Données Brutes:</h4>
        <pre style="background: #f3f4f6; padding: 1rem; border-radius: 8px; overflow-x: auto; font-size: 0.85rem;">${JSON.stringify(output, null, 2)}</pre>
      </div>
    `;
  }
}
