'use strict';
const parseDuration = require('parse-duration'),
  clock = require('./clock');

module.exports.get = options => {
  const throttler = new RollingWindowThrottler(options);
  return {
    tryAcquire: key => throttler.tryAcquire(key)
  };
};

class RollingWindowThrottler {
  constructor(options) {
    this.max = options.max;
    this.durationWindow = RollingWindowThrottler.calculateDuration(options.durationWindow);
    this.clock = options.clock || clock();
    this.invocations = {}
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
    return ((this.clock.currentMillis() - invocation.timestamp) > this.durationWindow)
  }

  getOrElseCreate(key) {
    return this.invocations[key]
      || (this.invocations[key] = this.newInvocation(), this.invocations[key]);
  }

  newInvocation() {
    return {
      count: 0,
      timestamp: this.clock.currentMillis()
    };
  }

  static incrementInvocationCount(invocation) {
    invocation.count++;
  }

  static calculateDuration(durationWindow) {
    return isNaN(durationWindow) ? parseDuration(durationWindow) : durationWindow;
  }
}