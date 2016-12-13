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
    const invocation = this.getOrElseCreate(key);
    RollingWindowThrottler.incrementInvocationCount(invocation);
    if (this.isExpires(invocation)) {
      delete this.invocations[key];
      return this.tryAcquire(key);
    }
    return invocation.count <= this.max;
  }

  isExpires(invocation) {
    return ((Date.now() - invocation.timestamp) > this.durationWindow)
  }

  getOrElseCreate(key) {
    return this.invocations[key] || (this.invocations[key] = RollingWindowThrottler.newInvocation());
  }

  static newInvocation() {
    return {
      count: 0,
      timestamp: Date.now()
    };
  }

  static incrementInvocationCount(invocation) {
    invocation.count++;
  }

  static calculateDuration(durationWindow) {
    return isNaN(durationWindow) ? parseDuration(durationWindow) : durationWindow;
  }
}