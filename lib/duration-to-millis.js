'use strict';
const parseDuration = require('parse-duration');

module.exports = durationToMillis;

function durationToMillis(durationWindow) {
  return isNaN(durationWindow) ? parseDuration(durationWindow) : durationWindow;
}
