'use strict';

// Every filter is a 3x3 matrix that turns a pixel's [r, g, b] into a new [r, g, b].
// The math runs on linear RGB (actual light levels), not the gamma-encoded values stored in the image.
var Filters = (function() {
  var identity = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
  ];

  var multiply = function(a, b) {
    return a.map(function(row) {
      return b[0].map(function(_, j) {
        return row.reduce(function(sum, value, k) { return sum + value * b[k][j]; }, 0);
      });
    });
  };

  // invert a square matrix with Gauss-Jordan elimination
  var invert = function(matrix) {
    var n = matrix.length;
    var a = matrix.map(function(row, i) {
      return row.concat(row.map(function(_, j) { return i === j ? 1 : 0; }));
    });
    for (var col = 0; col < n; col++) {
      // swap in the row with the biggest value in this column, so we never divide by ~0
      var pivot = col;
      for (var row = col + 1; row < n; row++) {
        if (Math.abs(a[row][col]) > Math.abs(a[pivot][col])) pivot = row;
      }
      var tmp = a[col]; a[col] = a[pivot]; a[pivot] = tmp;

      var scale = a[col][col];
      a[col] = a[col].map(function(v) { return v / scale; });
      for (var other = 0; other < n; other++) {
        if (other === col) continue;
        var factor = a[other][col];
        a[other] = a[other].map(function(v, j) { return v - factor * a[col][j]; });
      }
    }
    return a.map(function(row) { return row.slice(n); });
  };

  // mix a filter with no filter, amount 0 is no change and 1 is the full filter
  var blend = function(matrix, amount) {
    return matrix.map(function(row, i) {
      return row.map(function(value, j) { return identity[i][j] + (value - identity[i][j]) * amount; });
    });
  };

  // LMS is how much light each kind of cone in the eye (long, medium, short) picks up
  var rgbToLms = [
    [17.8824, 43.5161, 4.1193],
    [3.4557, 27.1554, 3.8671],
    [0.02996, 0.18431, 1.4670]
  ];
  var lmsToRgb = invert(rgbToLms);

  // go to LMS, switch off one cone, then come back to RGB
  var withoutCone = function(index) {
    var drop = identity.map(function(row) { return row.slice(); });
    drop[index][index] = 0;
    return multiply(lmsToRgb, multiply(drop, rgbToLms));
  };

  // brightness only, with the standard luminance weights
  var gray = [
    [0.2126, 0.7152, 0.0722],
    [0.2126, 0.7152, 0.0722],
    [0.2126, 0.7152, 0.0722]
  ];

  var normal = {
    id: 'normal',
    name: 'Normal vision',
    about: 'Pick a type of color blindness to see how this image looks with it.',
    matrix: identity
  };

  // Red-green and blue-yellow matrices are from Machado, Oliveira and Fernandes (2009).
  // The "-anomaly" types use their 60% severity matrix.
  var groups = [
    {
      name: 'Red-green',
      filters: [
        {
          id: 'protanopia',
          name: 'Protanopia',
          about: 'No red cones. Reds look dark and get mixed up with greens. About 1 in 100 men.',
          matrix: [
            [0.152286, 1.052583, -0.204868],
            [0.114503, 0.786281, 0.099216],
            [-0.003882, -0.048116, 1.051998]
          ]
        },
        {
          id: 'protanomaly',
          name: 'Protanomaly',
          about: 'Weak red cones. Reds look duller and darker. About 1 in 100 men.',
          matrix: [
            [0.385450, 0.769005, -0.154455],
            [0.100526, 0.829802, 0.069673],
            [-0.007442, -0.022190, 1.029632]
          ]
        },
        {
          id: 'deuteranopia',
          name: 'Deuteranopia',
          about: 'No green cones. Reds and greens look alike. About 1 in 100 men.',
          matrix: [
            [0.367322, 0.860646, -0.227968],
            [0.280085, 0.672501, 0.047413],
            [-0.011820, 0.042940, 0.968881]
          ]
        },
        {
          id: 'deuteranomaly',
          name: 'Deuteranomaly',
          about: 'Weak green cones. Greens look more red. The most common type, about 5 in 100 men.',
          matrix: [
            [0.498864, 0.674741, -0.173604],
            [0.205199, 0.754872, 0.039929],
            [-0.011131, 0.030969, 0.980162]
          ]
        }
      ]
    },
    {
      name: 'Blue-yellow',
      filters: [
        {
          id: 'tritanopia',
          name: 'Tritanopia',
          about: 'No blue cones. Blues look green and yellows look pink or gray. Rare, under 1 in 10,000 people.',
          matrix: [
            [1.255528, -0.076749, -0.178779],
            [-0.078411, 0.930809, 0.147602],
            [0.004733, 0.691367, 0.303900]
          ]
        },
        {
          id: 'tritanomaly',
          name: 'Tritanomaly',
          about: 'Weak blue cones. Blues look greener and yellows look paler. Very rare.',
          matrix: [
            [1.104996, -0.046633, -0.058363],
            [-0.032137, 0.971635, 0.060503],
            [0.001336, 0.317922, 0.680742]
          ]
        }
      ]
    },
    {
      name: 'No color',
      filters: [
        {
          id: 'achromatopsia',
          name: 'Achromatopsia',
          about: 'Complete color blindness. Everything is a shade of gray. About 1 in 30,000 people.',
          matrix: gray
        },
        {
          id: 'achromatomaly',
          name: 'Achromatomaly',
          about: 'Partial color blindness. Colors look faded, close to gray. Very rare.',
          matrix: blend(gray, 0.6)
        }
      ]
    },
    {
      name: 'Just for fun',
      filters: [
        {
          id: 'no-l-cones',
          name: 'No L cones',
          about: 'Switches off the long wavelength (red) cones in LMS color space.',
          matrix: withoutCone(0)
        },
        {
          id: 'no-m-cones',
          name: 'No M cones',
          about: 'Switches off the medium wavelength (green) cones in LMS color space.',
          matrix: withoutCone(1)
        },
        {
          id: 'no-s-cones',
          name: 'No S cones',
          about: 'Switches off the short wavelength (blue) cones in LMS color space.',
          matrix: withoutCone(2)
        },
        {
          id: 'rotate-rgb',
          name: 'Rotate RGB',
          about: 'Shifts the channels around, so green shows as red, blue as green and red as blue.',
          matrix: [
            [0, 1, 0],
            [0, 0, 1],
            [1, 0, 0]
          ]
        }
      ]
    }
  ];

  var find = function(id) {
    if (id === normal.id) return normal;
    for (var i = 0; i < groups.length; i++) {
      for (var j = 0; j < groups[i].filters.length; j++) {
        if (groups[i].filters[j].id === id) return groups[i].filters[j];
      }
    }
    return null;
  };

  // lookup tables for the sRGB curve, so each pixel is a few array reads instead of Math.pow calls
  var linearSteps = 65535;
  var toLinear = new Float32Array(256);
  for (var i = 0; i < 256; i++) {
    var c = i / 255;
    toLinear[i] = c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  }
  var fromLinear = new Uint8ClampedArray(linearSteps + 1);
  for (var j = 0; j <= linearSteps; j++) {
    var v = j / linearSteps;
    fromLinear[j] = 255 * (v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055);
  }
  var encode = function(v) {
    return fromLinear[v <= 0 ? 0 : v >= 1 ? linearSteps : Math.round(v * linearSteps)];
  };

  // returns a filtered copy, the source is left alone
  var apply = function(source, matrix) {
    var out = new ImageData(new Uint8ClampedArray(source.data), source.width, source.height);
    if (matrix === identity) return out;

    var d = out.data;
    var m0 = matrix[0], m1 = matrix[1], m2 = matrix[2];
    for (var i = 0; i < d.length; i += 4) {
      var r = toLinear[d[i]], g = toLinear[d[i + 1]], b = toLinear[d[i + 2]];
      d[i] = encode(m0[0] * r + m0[1] * g + m0[2] * b);
      d[i + 1] = encode(m1[0] * r + m1[1] * g + m1[2] * b);
      d[i + 2] = encode(m2[0] * r + m2[1] * g + m2[2] * b);
    }
    return out;
  };

  return { normal: normal, groups: groups, find: find, apply: apply };
})();
