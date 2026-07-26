import { eventBus } from '../core/eventBus.js';
import { ConsoleAnalytics } from './ConsoleAnalytics.js';
import { GoogleAnalytics } from './GoogleAnalytics.js';
export const AnalyticsManager = {
  driver: ConsoleAnalytics,
  init(driver = 'console') {
    this.driver = driver === 'google' ? GoogleAnalytics : ConsoleAnalytics;
    ['MODEL_STARTED', 'MODEL_FINISHED', 'MODEL_FAILED'].forEach(event => eventBus.subscribe(event, data => this.track(event, data)));
  },
  track(event, data) { this.driver.track(event, data); }
};
