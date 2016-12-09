'use strict';
const expect = require('chai').expect,
  durationToMillis = require('../lib/duration-to-millis');

describe("durationToMillis", function () {
  it('returns millis when given time in millis', function () {
    expect(durationToMillis(1)).to.equal(1);
  });

  it('parses millis given verbal time', function () {
    expect(durationToMillis('1s')).to.equal(1000);
  });
});
