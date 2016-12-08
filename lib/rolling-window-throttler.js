'use strict';

module.exports.get = options => new RollingWindowThrottler(options)

class RollingWindowThrottler{
  constructor(options) {
    this.max = options.max;
    this.durationWindow = options.durationWindow;
    this.count = 0;
  }

  tryAcquire(){
    this.count = this.count + 1;
    return this.count <= this.max;
  }
}