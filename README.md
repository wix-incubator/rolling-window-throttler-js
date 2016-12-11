# Rolling Window Throttler
Count invocation per key and returns boolean if invocation allowed within the rolling window for a given durationWindow and max invocations per key.

## Install

```sh
npm install --save rolling-window-throttler
```

## Usage

```js
const rollingWindowThrottler = require('rolling-window-throttler')
const throttler = rollingWindowThrottler.get({max: 1, durationWindow: '1s'})

if (throttler.tryAcquire('some-key')) {
  // not throttled, perform logic
}
```

## Api

### get({max, durationWindow}): RollingWindowThrottler
Create new instance of `RollingWindowThrottler`.

Parameters:
  - max - int, mandatory, number of allowed invocations for a key;
  - durationWindow - mandatory and can be one of:
    - milliseconds usage example: {durationWindow: 1000}
    - verbal period usage example: {durationWindow: '1m' / '1s' / '1hr 20mins'}

### RollingWindowThrottler.tryAcquire(key): boolean
Returns true if not throttled for provided key.

## License
Copyright (c) 2014 Wix.com Ltd. All Rights Reserved. Use of this source code is governed by a BSD-style license that can be found in the [LICENSE](LICENSE.md) file in the root of the source tree.