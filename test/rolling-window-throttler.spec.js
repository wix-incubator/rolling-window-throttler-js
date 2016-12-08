'use strict';
const expect = require('chai').expect,
  factory = require('..');

describe('rolling window throttler', () => {

  const key = '192.168.2.1';
  const aDefaultThrottler = () => factory.get({max: 1, durationWindow: 1000});

  beforeEach(function(){
    this.throttler = aDefaultThrottler();
  });

  it('Allow single request', function()  {
    expect(this.throttler.tryAcquire(key)).to.be.true;
  });

  it('Throttle second request', function()  {
    this.throttler.tryAcquire(key);
    expect(this.throttler.tryAcquire(key)).to.be.false;
  });

  it('Allow second request but from different key', function()  {
    const anotherKey = '200.200.200.1';
    expect(this.throttler.tryAcquire(key)).to.be.true;
    expect(this.throttler.tryAcquire(anotherKey)).to.be.true;
  });




});
