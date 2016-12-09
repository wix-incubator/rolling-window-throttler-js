'use strict';
const parseDuration = require('parse-duration'),
  clock = require('./clock');

module.exports.get = options => new RollingWindowThrottler(options);

class RollingWindowThrottler{
  constructor(options) {
    this.max = options.max;
    this.durationWindow = this._calculateDuration(options.durationWindow);
    this.clock = options.clock || clock();
    this.invocations = {}
  }


  tryAcquire(key){
    const invocation = this._getOrElseCreate(key);
    this._incrementInvocationCount(invocation);
    if(this._isExpires(invocation)){
      delete this.invocations[key];
      return this.tryAcquire(key);
    }
    return invocation.count <= this.max;
  }

  _isExpires(invocation){
    return ((this.clock.currentMillis() - invocation.timestamp) > this.durationWindow)
  }

  _getOrElseCreate(key){
    return this.invocations[key] 
      || (this.invocations[key] = this._newInvocation(), this.invocations[key]);
  }

  _newInvocation(){
    return {count: 0,
            timestamp: this.clock.currentMillis()};
  }

  _incrementInvocationCount(invocation){
    invocation.count++;
  }

  _calculateDuration(durationWindow){
    return isNaN(durationWindow) ? parseDuration(durationWindow) : durationWindow;
  }

}

