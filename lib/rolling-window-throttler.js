'use strict';
const HashMap = require('hashmap');

module.exports.get = options => new RollingWindowThrottler(options);

class RollingWindowThrottler{
  constructor(options) {
    this.max = options.max;
    this.durationWindow = options.durationWindow;
    this.clock = options.clock || new Clock();
    this.invocations = new HashMap();
  }

  tryAcquire(key){
    const invocation = this._getOrElseCreate(key);
    if(this._expires(invocation)){
      this.invocations.remove(key);
      return this.tryAcquire(key);
    }
    return invocation.count <= this.max;
  }

  _expires(invocation){
    return ((this.clock.millis() - invocation.timestamp) > this.durationWindow)
  }

  _getOrElseCreate(key){
    if(!this.invocations.has(key)){
      this.invocations.set(key, {count: 1, timestamp: this.clock.millis()});
    }else {
      const invocation = this.invocations.get(key);
      invocation.count = invocation.count + 1;
    }
    return this.invocations.get(key);
  }
}

class Clock{
  millis(){
    return new Date().getMilliseconds();
  }
}