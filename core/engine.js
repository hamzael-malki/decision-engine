import { eventBus } from './eventBus.js';
import { ProviderFactory } from '../providers/ProviderFactory.js';
export const engine = {
    async executeModel(modelConfig, userInput, providerType = null) {
        eventBus.publish('MODEL_STARTED', { modelId: modelConfig.id });
        const selectedProvider = providerType || modelConfig.defaultProvider;
        const provider = ProviderFactory.getProvider(selectedProvider);
        try {
            const result = await provider.execute(modelConfig, userInput);
            eventBus.publish('MODEL_FINISHED', { 
                modelId: modelConfig.id, 
                provider: selectedProvider,
                success: true 
            });
            return result;
        } catch (error) {
            eventBus.publish('MODEL_FAILED', { 
                modelId: modelConfig.id, 
                error: error.message 
            });
            throw error;
        }
    }
};
