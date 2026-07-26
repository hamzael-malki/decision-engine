import { config } from '../config.js';
import { validator } from '../core/validator.js';
export const AIProvider = {
  async execute(modelConfig, userInput) {
    validator.validateInput(modelConfig, userInput);
    const { endpoint, apiKey } = config.providers.ai;
    if (!endpoint) throw new Error('Le point d’accès IA n’est pas configuré.');
    const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(apiKey && { Authorization: `Bearer ${apiKey}` }) }, body: JSON.stringify({ model: modelConfig, input: userInput }) });
    if (!response.ok) throw new Error(`Échec du provider IA (${response.status}).`);
    return response.json();
  }
};
