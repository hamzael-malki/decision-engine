import { LocalProvider } from './LocalProvider.js';
import { AIProvider } from './AIProvider.js';
export const ProviderFactory = {
  getProvider(type) {
    const providers = { local: LocalProvider, ai: AIProvider };
    if (!providers[type]) throw new Error(`Provider inconnu : ${type}`);
    return providers[type];
  }
};
