var Pixel = {
    normal: [
      [ 1, 0, 0, 0 ],
      [ 0, 1, 0, 0 ],
      [ 0, 0, 1, 0 ],
      [ 0, 0, 0, 1 ]
    ],
    protanopia: [
      [ 0.567, 0.433, 0, 0 ],
      [ 0.558, 0.442, 0, 0 ],
      [ 0, 0.242, 0.758, 0 ],
      [ 0, 0, 0, 1 ]
    ],
    protanomaly: [
      [ 0.817, 0.183, 0, 0 ],
      [ 0.333, 0.667, 0, 0 ],
      [ 0, 0.125, 0.875, 0 ],
      [ 0, 0, 0, 1 ]
    ],
    deuteranopia: [
      [ 0.625, 0.375, 0, 0 ],
      [ 0.7, 0.3, 0, 0 ],
      [ 0, 0.3, 0.7, 0 ],
      [ 0, 0, 0, 1 ]
    ],
    deuteranomaly: [
      [ 0.8, 0.2, 0, 0 ],
      [ 0.258, 0.742, 0, 0 ],
      [ 0, 0.142, 0.858, 0 ],
      [ 0, 0, 0, 1 ]
    ],
    tritanopia: [
      [ 0.95, 0.05, 0, 0 ],
      [ 0, 0.433, 0.567, 0 ],
      [ 0, 0.475, 0.525, 0 ],
      [ 0, 0, 0, 1 ]
    ],
    tritanomaly: [
      [ 0.967, 0.033, 0, 0 ],
      [ 0, 0.733, 0.267, 0 ],
      [ 0, 0.183, 0.817, 0 ],
      [ 0, 0, 0, 1 ]
    ],
    achromatopsia: [
      [ 0.299, 0.587, 0.114, 0 ],
      [ 0.299, 0.587, 0.114, 0 ],
      [ 0.299, 0.587, 0.114, 0 ],
      [ 0, 0, 0, 1 ]
    ],
    achromatomaly: [
      [ 0.618, 0.320, 0.062, 0 ],
      [ 0.163, 0.775, 0.062, 0 ],
      [ 0.163, 0.320, 0.516, 0 ],
      [ 0, 0, 0, 1 ]
    ]
};

Pixel.RGBtoLMS = [
  [ 17.8824, 43.5161, 4.1193, 0 ],
  [ 3.4557, 27.1554, 3.8671, 0 ],
  [ 0.02996, 0.18431, 1.4670, 0 ],
  [ 0, 0, 0, 1]
];
// invert a square matrix with Gauss-Jordan elimination
Pixel.invert = function(matrix) {
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
Pixel.LMStoRGB = Pixel.invert(Pixel.RGBtoLMS);
Pixel.protanopiaLMS = [
  [ 0, 2.02344, -2.52581, 0 ],
  [ 0, 1, 0, 0 ],
  [ 0, 0, 1, 0 ],
  [ 0, 0, 0, 1 ]
];

Pixel.protanopiaRGB = [
      [ 0.567, 0.433, 0,     0 ],
      [ 0.558, 0.442, 0,     0 ],
      [ 0,     0.242, 0.758, 0 ],
      [ 0,     0,     0,     1 ]
];



Pixel.transform = function(rgba, matrix) {
  return {
    r: matrix[0][0] * rgba.r + matrix[0][1] * rgba.g + matrix[0][2] * rgba.b + matrix[0][3] * rgba.a,
    g: matrix[1][0] * rgba.r + matrix[1][1] * rgba.g + matrix[1][2] * rgba.b + matrix[1][3] * rgba.a,
    b: matrix[2][0] * rgba.r + matrix[2][1] * rgba.g + matrix[2][2] * rgba.b + matrix[2][3] * rgba.a,
    a: matrix[3][0] * rgba.r + matrix[3][1] * rgba.g + matrix[3][2] * rgba.b + matrix[3][3] * rgba.a
  }
};

