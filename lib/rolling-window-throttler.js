const parseDuration = require('parse-duration'),
  clock = require('./clock');

module.exports.get = options => {
  const throttler = new RollingWindowThrottler(options);
  return {
    tryAcquire: key => throttler.tryAcquire(key)
  };
};


function RollingWindowThrottler(options){
  this.max = options.max;
  this.durationWindow = calculateDuration(options.durationWindow);
  this.clock = options.clock || clock();
  this.invocations = {}
}

RollingWindowThrottler.prototype.tryAcquire = function(key){
  const invocation = this.getOrElseCreate(key);
  incrementInvocationCount(invocation);
  if (this.isExpires(invocation)) {
    delete this.invocations[key];
    return this.tryAcquire(key);
  }
  return invocation.count <= this.max;
};



RollingWindowThrottler.prototype.isExpires = function(invocation) {
  return ((this.clock.currentMillis() - invocation.timestamp) > this.durationWindow)
};

RollingWindowThrottler.prototype.getOrElseCreate = function(key) {
  return this.invocations[key]
    || (this.invocations[key] = this.newInvocation(), this.invocations[key]);
};

RollingWindowThrottler.prototype.newInvocation = function() {
  return {
    count: 0,
    timestamp: this.clock.currentMillis()
  };
};

const incrementInvocationCount = function(invocation) {
  invocation.count++;
};

const calculateDuration = durationWindow =>  {
  return isNaN(durationWindow) ? parseDuration(durationWindow) : durationWindow;
};

