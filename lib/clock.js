'use strict';

module.exports = () => new Clock();


class Clock {
  currentMillis() {
    return new Date().getMilliseconds();
  }
}
