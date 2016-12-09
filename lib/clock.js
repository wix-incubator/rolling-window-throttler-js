'use strict';

module.exports = () => new Clock();


class Clock {
  millis() {
    return new Date().getMilliseconds();
  }
}
