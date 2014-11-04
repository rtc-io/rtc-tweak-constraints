var curry = require('curry');

/**
  # rtc-constraints

  A series of functional helpers for applying transforms to media capture constraints.

  ## Reference
**/

var tweak = module.exports = function(targets, mediaType) {

  function createSetter(target) {
    var keys = target.split('.');
    var lastIdx = keys.length - 1;

    return function(data, value) {
      keys.forEach(function(key, idx) {
        if ((idx < lastIdx) && (! data[key])) {
          data = data[key] = {};
        }
        else if (idx === lastIdx) {
          data[key] = value;
        }
      });
    };
  }

  var applyTweak = curry(function(section, constraints, value) {
    var mediaConstraints = constraints[mediaType];

    if ((! mediaConstraints) || typeof mediaConstraints == 'boolean') {
      mediaConstraints = constraints[mediaType] = {};
    }

    // ensure we have the required section
    if (! mediaConstraints[section]) {
      mediaConstraints[section] = {};
    }

    targets.forEach(function(updater) {
      updater(mediaConstraints[section], value);
    });

    return constraints;
  });

  var tweaker = applyTweak('mandatory');

  // ensure targets is an array
  targets = [].concat(targets || []).map(createSetter);

  // ensure we have a value for mediaType (default to video)
  mediaType = mediaType || 'video';

  // add the optional helper to allow optional modifications
  tweaker.optional = tweaker.opt = applyTweak('optional');

  return tweaker;
};

tweak.fps = tweak.maxfps = tweak(['fps.max']);
