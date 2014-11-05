# rtc-constraints

A series of functional helpers for applying transforms to media capture constraints.


[![NPM](https://nodei.co/npm/rtc-tweak-constraints.png)](https://nodei.co/npm/rtc-tweak-constraints/)



## Example Usage

```js
var tweak = require('rtc-tweak-constraints');
var getUserMedia = require('getusermedia');
var streamui = require('rtc-ui/stream');
var chain = require('whisk/chain');

// create a limiter function
var adjustDimensions = chain([ tweak.w(160), tweak.h(120) ]);

// generate constraints with limited frame capture rate
var constraints = adjustDimensions(({ audio: true, video: true }));
console.log(constraints);

// capture media
getUserMedia(constraints, function(err, stream) {
  if (err) {
    return console.error(err);
  }

  // render the local stream using the stream ui
  streamui.local(document.body)(stream);
});

```

## Reference

### `tweak.maxwidth(value, => constraints) => constraints`

Apply appropriate maxwidth constraints.

### `tweak.minwidth(value, => constraints) => constraints`

Apply appropriate minwidth constraints.

### `tweak.width(value, => constraints) => constraints`

Apply both minwidth and maxwidth constraints.

### `tweak.maxheight(value, => constraints) => constraints`

Apply appropriate maxheight constraints.

### `tweak.minheight(value, => constraints) => constraints`

Apply appropriate minheight constraints.

### `tweak.height(value, => constraints) => constraints`

Apply both minheight and maxheight constraints.

### `tweak.maxfps(value, => constraints) => constraints`

Apply appropriate max framerate constraints.

### `tweak.minfps(value, => constraints) => constraints`

Apply appropriate min framerate constraints.

### `tweak.fps(value, => constraints) => constraints`

Apply both min and max framerate constraints.

## License(s)

### Apache 2.0

Copyright 2014 Damon Oehlman <damon.oehlman@nicta.com.au>

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
