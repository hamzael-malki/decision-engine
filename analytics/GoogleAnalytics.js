export const GoogleAnalytics = { track(event, data) { if (typeof window.gtag === 'function') window.gtag('event', event, data); } };
