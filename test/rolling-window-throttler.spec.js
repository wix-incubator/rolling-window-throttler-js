'use strict';
const expect = require('chai').expect,
  factory = require('..');

describe('rolling window throttler', () => {

  const key = '192.168.2.1';
  const aDefaultThrottler = clock => factory.get({max: 1,
                                               durationWindow: 1000,
                                               clock: clock});

  beforeEach(function(){
    this.clock = new FakeClock();
    this.throttler = aDefaultThrottler(this.clock);
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

  it('re-allow request after the rolling window', function()  {
    this.throttler.tryAcquire(key);
    this.clock.age(2000);
    expect(this.throttler.tryAcquire(key)).to.be.true;
  });

  it('Not providing clock should work, has default clock', function(){
    const throttler = aDefaultThrottler();
    expect(throttler.tryAcquire(key)).to.be.true;
  });

  class FakeClock{
    constructor(){
      this.currentTime = 1;
    }
    age(ms){
      this.currentTime = this.currentTime + ms;
    }
    millis(){
      return this.currentTime;
    }
  }

});
