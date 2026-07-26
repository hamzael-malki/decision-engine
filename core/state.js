import { eventBus } from './eventBus.js';
export const state = {
    _data: {
        currentModel: null,
        history: [],
        isLoading: false
    },
    set(key, value) {
        this._data[key] = value;
        eventBus.publish(`STATE_CHANGED:${key.toUpperCase()}`, value);
    },
    get(key) {
        return this._data[key];
    }
};
