var tweak = require('..');
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
