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

  var applyTweak = curry(function(section, value, constraints) {
    var mediaConstraints = constraints[mediaType];
    var sectionData;

    if ((! mediaConstraints) || typeof mediaConstraints == 'boolean') {
      mediaConstraints = constraints[mediaType] = {};
    }

    // ensure we have the required section
    sectionData = mediaConstraints[section];
    if (! mediaConstraints[section]) {
      sectionData = mediaConstraints[section] = section === 'mandatory' ? {} : [];
    }

    targets.forEach(function(updater) {
      if (Array.isArray(sectionData)) {
        updater(sectionData[sectionData.length] = {}, value);
        return;
      }

      updater(sectionData, value);
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

tweak.fps = tweak.maxfps = tweak(['frameRate.max']);
