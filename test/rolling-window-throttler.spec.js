'use strict';
const expect = require('chai').expect,
  factory = require('..');

describe('rolling window throttler', () => {

  const key = '192.168.2.1';
  const aThrottler = (clock, durationWindow) => factory.get({max: 1,
                                               durationWindow: durationWindow,
                                               clock: clock});

  beforeEach(function(){
    this.clock = new FakeClock();
    this.throttler = aThrottler(this.clock, 1000);
  });


  it('Should allow single request', function()  {
    expect(this.throttler.tryAcquire(key)).to.be.true;
  });

  it('Should throttle second request', function()  {
    this.throttler.tryAcquire(key);
    expect(this.throttler.tryAcquire(key)).to.be.false;
  });

  it('should allow second request but from different key', function()  {
    const anotherKey = '200.200.200.1';
    expect(this.throttler.tryAcquire(key)).to.be.true;
    expect(this.throttler.tryAcquire(anotherKey)).to.be.true;
  });

  it('should re-allow request after the rolling window', function()  {
    this.throttler.tryAcquire(key);
    this.clock.age(2000);
    expect(this.throttler.tryAcquire(key)).to.be.true;
  });
  it('should work with verbal durationWindow and not milliseconds', function()  {
    const throttler = aThrottler(this.clock, '1s');
    throttler.tryAcquire(key);
    this.clock.age(2000);
    expect(throttler.tryAcquire(key)).to.be.true;
  });


  it('Not providing clock should work, has default clock', function(){
    const throttler = aThrottler(null, 1000);
    expect(throttler.tryAcquire(key)).to.be.true;
  });

});

class FakeClock{
  constructor(){
    this.currentTime = new Date().getMilliseconds();
  }
  age(ms){
    this.currentTime = this.currentTime + ms;
  }
  currentMillis(){
    return this.currentTime;
  }
}
