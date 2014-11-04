var test = require('tape');
var constraints = require('../');
var expected = {
  video: {
    mandatory: {
      frameRate: {
        max: 5
      }
    }
  },
  audio: true
};

var expectedOptional = {
  video: {
    optional: [
      { frameRate: { max: 5 } }
    ]
  },
  audio: true
};

test('apply maxfps constraints', function(t) {
  t.plan(1);
  t.deepEqual(constraints.fps.mandatory(5, { video: true, audio: true }), expected);
});

test('apply maxfps constraints - optional', function(t) {
  t.plan(1);
  t.deepEqual(constraints.fps.optional(5, { video: true, audio: true }), expectedOptional);
});
