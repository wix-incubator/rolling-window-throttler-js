# rolling window throttler

## Description
Counts invocations per key and returns boolean if invocation is allowed within the rolling
window for a given `durationWindow` and `max` invocations per key

## Usage

```javascript
   const throttlerFactory = require('rolling-window-throttler')
   const throttler = throttlerFactory.Throttler({
     max: 1,
     durationWindow: 1000
   })
   throttler.tryAcquire("some-key") // returns boolean

```
## durationWindow
1. milliseconds usage example: `{ durationWindow: 1000 }`
2. verbal period usage example: `{ durationWindow: '1m' / '1s' / '1hr 20mins' }`

