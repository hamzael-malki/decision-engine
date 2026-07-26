export const eventBus = {
    listeners: {},
    subscribe(event, callback) {
        if (typeof callback !== 'function') throw new TypeError('Un listener doit être une fonction.');
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
        return () => this.unsubscribe(event, callback);
    },
    unsubscribe(event, callback) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(listener => listener !== callback);
        if (this.listeners[event].length === 0) delete this.listeners[event];
    },
    publish(event, data) {
        if (!this.listeners[event]) return;
        [...this.listeners[event]].forEach(callback => {
            try { callback(data); }
            catch (error) { console.error(`Erreur dans le listener ${event}`, error); }
        });
    }
};
