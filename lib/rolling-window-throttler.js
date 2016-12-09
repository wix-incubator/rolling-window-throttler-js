'use strict';
const
  durationToMillis = require('./duration-to-millis'),
  defaultClock = require('./clock');

module.exports.Throttler = ({durationWindow, max, clock = defaultClock()}) => {
  return rollingWindowThrottler(durationToMillis(durationWindow), max, clock);
};

function rollingWindowThrottler(durationWindow, max, clock) {
  const invocations = {};

  function hasExpired(invocation) {
    const millisSinceLastInvocation = clock.currentMillis() - invocation.timestamp;
    return millisSinceLastInvocation > durationWindow;
  }

  function getOrCreate(key) {
    return invocations[key] || (invocations[key] = newInvocation(), invocations[key]);
  }

  function newInvocation() {
    return {
      count: 0,
      timestamp: clock.currentMillis()
    };
  }

  function incrementInvocationCount(invocation) {
    invocation.count++;
  }

  return {
    tryAcquire(key) {
      const invocation = getOrCreate(key);
      incrementInvocationCount(invocation);

      if (hasExpired(invocation)) {
        delete invocations[key];
        return this.tryAcquire(key);
      }

      return invocation.count <= max;
    }
  }
}
