# Rolling Window Throttler [![Build Status](https://img.shields.io/travis/wix/rolling-window-throttler-js/master.svg?label=build%20status)](https://travis-ci.org/wix/rolling-window-throttler-js) [![npm version](https://img.shields.io/npm/v/rolling-window-throttler.svg)](https://www.npmjs.com/package/rolling-window-throttler)

Count invocations per key and returns `true` if invocation allowed within provided `durationWindow` and `max` invocations per key.

## Install

```sh
npm install --save rolling-window-throttler
```

## Usage

```js
const rollingWindowThrottler = require('rolling-window-throttler')
const throttler = rollingWindowThrottler({max: 1, durationWindow: '1s'})

if (throttler.tryAcquire('some-key')) {
  // not throttled, perform logic
}
```

## Api

### ({max, durationWindow}): RollingWindowThrottler
Create new instance of `RollingWindowThrottler`.

Parameters:
  - max - int, mandatory, number of allowed invocations for a key;
  - durationWindow - mandatory and can be one of:
    - ms, ex. {durationWindow: 1000};
    - verbal period, ex. {durationWindow: '1m' / '1s' / '1hr 20mins'} as per [parse-duration](https://www.npmjs.com/package/parse-duration).

### RollingWindowThrottler.tryAcquire(key): boolean
Returns true if not throttled for provided key.

## Package version
Note that package uses [wnpm-ci](https://www.npmjs.com/package/wnpm-ci) to publish package to [npmjs](https://www.npmjs.com). This just means that patch part of package version in git repo does not match that of published to [npmjs](https://www.npmjs.com).

## License
Copyright (c) 2014 Wix.com Ltd. All Rights Reserved. Use of this source code is governed by a BSD-style license that can be found in the [LICENSE](LICENSE.md) file in the root of the source tree.
