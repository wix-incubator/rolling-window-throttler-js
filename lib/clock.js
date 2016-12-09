'use strict';

module.exports = () => clock();

function clock() {
  return {
    currentMillis() {
      return new Date().getTime();
    }
  }
}

