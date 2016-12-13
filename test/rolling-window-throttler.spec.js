'use strict';
const expect = require('chai').expect,
  rollingWindowThrottler = require('..'),
  sinon = require('sinon');

describe('rolling window throttler', () => {
  const key = '192.168.2.1';
  let throttler;

  beforeEach(() => throttler = aThrottler(1000));

  it('Should allow single request', () => {
    expect(throttler.tryAcquire(key)).to.equal(true);
  });

  it('Should throttle second request', () => {
    throttler.tryAcquire(key);
    expect(throttler.tryAcquire(key)).to.equal(false);
  });

  it('should allow second request but from different key', () => {
    const anotherKey = '200.200.200.1';
    expect(throttler.tryAcquire(key)).to.equal(true);
    expect(throttler.tryAcquire(anotherKey)).to.equal(true);
  });

  it('should re-allow request after the rolling window', sinon.test(function() {
    throttler.tryAcquire(key);
    this.clock.tick(2000);
    expect(throttler.tryAcquire(key)).to.equal(true);
  }));

  it('should work with verbal durationWindow and not milliseconds', sinon.test(function() {
    throttler = aThrottler('1s');
    throttler.tryAcquire(key);
    this.clock.tick(2000);
    expect(throttler.tryAcquire(key)).to.equal(true);
  }));

  function aThrottler(durationWindow) {
    return rollingWindowThrottler({max: 1, durationWindow: durationWindow || 1000});
  }

});