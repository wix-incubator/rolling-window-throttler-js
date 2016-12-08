'use strict';
const HashMap = require('hashmap');

module.exports.get = options => new RollingWindowThrottler(options)

class RollingWindowThrottler{
  constructor(options) {
    this.max = options.max;
    this.durationWindow = options.durationWindow;
    this.invocations = new HashMap();
  }

  tryAcquire(key){
    const invocation = this._getOrElseCreate(key);
    return invocation.count <= this.max;
  }

  _getOrElseCreate(key){
    if(!this.invocations.has(key)){
      this.invocations.set(key, {count: 1});
    }else {
      const invocation = this.invocations.get(key);
      invocation.count = invocation.count + 1;
    }
    return this.invocations.get(key);
  }
}