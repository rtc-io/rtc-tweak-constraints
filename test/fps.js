var test = require('tape');
var constraints = require('../');
var expected = {
  video: {
    mandatory: {
      fps: {
        max: 5
      }
    }
  },
  audio: true
};

test('apply maxfps constraints', function(t) {
  t.plan(1);
  t.deepEqual(constraints.fps({ video: true, audio: true }, 5), expected);
});
