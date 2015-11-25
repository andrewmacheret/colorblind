var Filters = {};
Filters.rgbaFilter = function(pixels, rgbaFunction) {
  var width = pixels.getWidth();
  var height = pixels.getHeight();
  for (var y=0; y<height; y++) {
    for (var x=0; x<width; x++) {
      var rgba = pixels.getRGBA(x, y);
      rgba = rgbaFunction(rgba);
      pixels.setRGBA(x, y, rgba);
    }
  }
}

Filters.lmsaFilter = function(pixels, lmsaFunction) {
  Filters.rgbaFilter(pixels, function(rgba) {
    var lmsa = Pixel.transform(rgba, Pixel.RGBtoLMS);
    lmsa = lmsaFunction(lmsa);
    var rgba = Pixel.transform(lmsa, Pixel.LMStoRGB);
    return rgba;
  });
}

Filters.grayscale = function(pixels) {
  Filters.rgbaFilter(pixels, function(rgba) {
    var grayValue = 0.2126*rgba.r + 0.7152*rgba.g + 0.0722*rgba.b;
    return {
      r: grayValue,
      g: grayValue,
      b: grayValue,
      a: rgba.a
    };
  });
};

Filters.rotateRGB = function(pixels) {
  Filters.rgbaFilter(pixels, function(rgba) {
    return {
      r: rgba.g,
      g: rgba.b,
      b: rgba.r,
      a: rgba.a
    };
  });
};

Filters.applyProtanopiaLMS = function(pixels) {
  Filters.lmsaFilter(pixels, function(lmsa) {
    return Pixel.transform(lmsa, Pixel.protanopiaLMS);
  });
};

Filters.applyProtanopia = function(pixels) {
  Filters.rgbaFilter(pixels, function(rgba) {
    return Pixel.transform(rgba, Pixel.protanopia);
  });
};
Filters.applyProtanomaly = function(pixels) {
  Filters.rgbaFilter(pixels, function(rgba) {
    return Pixel.transform(rgba, Pixel.protanomaly);
  });
};
Filters.applyDeuteranopia = function(pixels) {
  Filters.rgbaFilter(pixels, function(rgba) {
    return Pixel.transform(rgba, Pixel.deuteranopia);
  });
};
Filters.applyDeuteranomaly = function(pixels) {
  Filters.rgbaFilter(pixels, function(rgba) {
    return Pixel.transform(rgba, Pixel.deuteranomaly);
  });
};
Filters.applyTritanopia = function(pixels) {
  Filters.rgbaFilter(pixels, function(rgba) {
    return Pixel.transform(rgba, Pixel.tritanopia);
  });
};
Filters.applyTritanomaly = function(pixels) {
  Filters.rgbaFilter(pixels, function(rgba) {
    return Pixel.transform(rgba, Pixel.tritanomaly);
  });
};
Filters.applyAchromatopsia = function(pixels) {
  Filters.rgbaFilter(pixels, function(rgba) {
    return Pixel.transform(rgba, Pixel.achromatopsia);
  });
};
Filters.applyAchromatomaly = function(pixels) {
  Filters.rgbaFilter(pixels, function(rgba) {
    return Pixel.transform(rgba, Pixel.achromatomaly);
  });
};

Filters.removeConeL = function(pixels) {
  Filters.lmsaFilter(pixels, function(lmsa) {
    var r = (lmsa.r / 255.0);
    return {
      r: 0,
      g: lmsa.g,// + r * (255 - lmsa.g),
      b: lmsa.b,// + r * (255 - lmsa.b),
      a: lmsa.a
    };
  });
};

Filters.removeConeM = function(pixels) {
  Filters.lmsaFilter(pixels, function(lmsa) {
    var g = lmsa.g / 255.0;
    return {
      r: lmsa.r,// + g * (255 - lmsa.r),
      g: 0,
      b: lmsa.b,// + g * (255 - lmsa.b),
      a: lmsa.a
    };
  });
};

Filters.removeConeS = function(pixels) {
  Filters.lmsaFilter(pixels, function(lmsa) {
    var b = lmsa.b / 255.0;
    return {
      r: lmsa.r,// + b * (255 - lmsa.r),
      g: lmsa.g,// + b * (255 - lmsa.g),
      b: 0,
      a: lmsa.a
    };
  });
};

