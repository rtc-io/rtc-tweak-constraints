var curry = require('curry');
var KEYS_MAXWIDTH = ['maxWidth', 'width.max'];
var KEYS_MINWIDTH = ['minWidth', 'width.min'];
var KEYS_MAXHEIGHT = ['maxHeight', 'height.max'];
var KEYS_MINHEIGHT = ['minHeight', 'height.min'];
var KEYS_MAXFPS = ['maxFrameRate', 'frameRate.max'];
var KEYS_MINFPS = ['minFrameRate', 'frameRate.min'];

/**
  # rtc-constraints

  A series of functional helpers for applying transforms to media capture constraints.

  ## Example Usage

  <<< examples/limit-dimensions.js

  ## Reference
**/

var tweak = module.exports = function(targets, opts) {
  var mediaType = (opts || {}).mediaType || 'video';

  function createSetter(target) {
    var keys = target.split('.');
    var lastIdx = keys.length - 1;

    return function setValue(data, value) {
      var existingSection;

      if (Array.isArray(data)) {
        existingSection = data.filter(function(item) {
          return item[keys[0]];
        })[0];

        if (existingSection) {
          return setValue(existingSection, value);
        }

        return setValue(data[data.length] = {}, value);
      }

      keys.forEach(function(key, idx) {
        if (idx < lastIdx) {
          if (! data[key]) {
            data[key] = {};
          }

          data = data[key];
        }
        else {
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
      updater(sectionData, value);
    });

    return constraints;
  });

  var tweaker = applyTweak((opts || {}).section || 'optional');

  // ensure targets is an array
  targets = [].concat(targets || []).map(createSetter);

  // ensure we have a value for mediaType (default to video)
  mediaType = mediaType || 'video';

  // add the optional helper to allow optional modifications
  tweaker.optional = tweaker.opt = applyTweak('optional');
  tweaker.mandatory = applyTweak('mandatory');

  return tweaker;
};

/**
  ##### `tweak.maxwidth(value, => constraints) => constraints`

  Apply appropriate maxwidth constraints.
**/
tweak.maxwidth = tweak(KEYS_MAXWIDTH);

/**
  ##### `tweak.minwidth(value, => constraints) => constraints`

  Apply appropriate minwidth constraints.
**/
tweak.minwidth = tweak(KEYS_MINWIDTH);

/**
  ##### `tweak.width(value, => constraints) => constraints`

  Apply both minwidth and maxwidth constraints.
**/
tweak.width = tweak.w = tweak(KEYS_MINWIDTH.concat(KEYS_MAXWIDTH));


/**
  ##### `tweak.maxheight(value, => constraints) => constraints`

  Apply appropriate maxheight constraints.
**/
tweak.maxheight = tweak(KEYS_MAXHEIGHT);

/**
  ##### `tweak.minheight(value, => constraints) => constraints`

  Apply appropriate minheight constraints.
**/
tweak.minheight = tweak(KEYS_MINHEIGHT);

/**
  ##### `tweak.height(value, => constraints) => constraints`

  Apply both minheight and maxheight constraints.
**/
tweak.height = tweak.h = tweak(KEYS_MINHEIGHT.concat(KEYS_MAXHEIGHT));

/**
  ##### `tweak.maxfps(value, => constraints) => constraints`

  Apply appropriate max framerate constraints.
**/
tweak.maxfps = tweak(KEYS_MAXFPS);

/**
  ##### `tweak.minfps(value, => constraints) => constraints`

  Apply appropriate min framerate constraints.
**/
tweak.minfps = tweak(KEYS_MINFPS);


/**
  ##### `tweak.fps(value, => constraints) => constraints`

  Apply both min and max framerate constraints.
**/
tweak.fps = tweak(KEYS_MINFPS.concat(KEYS_MAXFPS));
