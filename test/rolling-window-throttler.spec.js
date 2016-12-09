'use strict';
const
  expect = require('chai').expect,
  factory = require('..');

const key = '192.168.2.1';
function aThrottler() {
  return factory.Throttler({
    max: 1,
    durationWindow: '1 second',
    clock: fakeClock()
  });
}

describe('rolling window throttler', function () {
  it('allows single request', function () {
    const throttler = aThrottler();

    expect(throttler.tryAcquire(key)).to.be.true;
  });

  it('throttles second request', function () {
    const throttler = aThrottler();

    throttler.tryAcquire(key);

    expect(throttler.tryAcquire(key)).to.be.false;
  });

  it('allows second request but from different key', function () {
    const throttler = aThrottler();
    const anotherKey = '200.200.200.1';

    expect(throttler.tryAcquire(key)).to.be.true;
    expect(throttler.tryAcquire(anotherKey)).to.be.true;
  });

  it('allows request after the rolling window expires', function () {
    const agingClock = fakeClock();
    const throttler = factory.Throttler({
      max: 1,
      durationWindow: '1 second',
      clock: agingClock
    });

    throttler.tryAcquire(key);
    agingClock.ageTwoSeconds();

    expect(throttler.tryAcquire(key)).to.be.true;
  });

  it('uses default clock if one was not provided', function () {
    const throttler = factory.Throttler({
      max: 1,
      durationWindow: '1 second'
    });

    expect(throttler.tryAcquire(key)).to.be.true;
  });

});

function fakeClock() {
  let currentTime = new Date().getTime();
  return {
    ageTwoSeconds() {
      currentTime = currentTime + 2000;
    },

    currentMillis() {
      return currentTime;
    }
  }
}
