'use strict';
const HashMap = require('hashmap'),
  clock = require('./clock');

module.exports.get = options => new RollingWindowThrottler(options);

class RollingWindowThrottler{
  constructor(options) {
    this.max = options.max;
    this.durationWindow = options.durationWindow;
    this.clock = options.clock || clock();
    this.invocations = new HashMap();
  }

  tryAcquire(key){
    const invocation = this._getOrElseCreate(key);
    this._incrementInvocationCount(invocation);
    if(this._isExpires(invocation)){
      this.invocations.remove(key);
      return this.tryAcquire(key);
    }
    return invocation.count <= this.max;
  }

  _isExpires(invocation){
    return ((this.clock.currentMillis() - invocation.timestamp) > this.durationWindow)
  }

  _getOrElseCreate(key){
    if(!this.invocations.has(key)){
      this.invocations.set(key, this._newInvocation());
    }
    return this.invocations.get(key);
  }

  _newInvocation(){
    return {count: 0,
            timestamp: this.clock.currentMillis()};
  }

  _incrementInvocationCount(invocation){
    invocation.count = invocation.count + 1;
  }
}

