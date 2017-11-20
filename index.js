'use strict';
const parseDuration = require('parse-duration');

module.exports = options => {
  const throttler = new RollingWindowThrottler(options);
  return {
    tryAcquire: key => throttler.tryAcquire(key)
  };
};

class RollingWindowThrottler {
  constructor(options) {
    this.max = options.max;
    this.durationWindow = RollingWindowThrottler.calculateDuration(options.durationWindow);
    this.invocations = {};
  }

  tryAcquire(key) {
    this.invocations[key] = this.invocations[key] || [];
    const now = Date.now();
    this.invocations[key].push(now);

    this.filterExpiredTries(key, now);
    return this.invocations[key].length <= this.max;
  }

  filterExpiredTries(key, now) {
    const now = now || Date.now();
    this.invocations[key] = this.invocations[key].filter(invTime => now - invTime < this.durationWindow);
  }

  static calculateDuration(durationWindow) {
    return isNaN(durationWindow) ? parseDuration(durationWindow) : durationWindow;
  }
}
