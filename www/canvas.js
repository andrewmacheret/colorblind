var Canvas = {};

Canvas.init = function(canvas, imageSource) {
  this.canvas = canvas;
  this.image = new Image();
  this.loadImage(imageSource);
};

Canvas.loadImage = function(imageSource) {
  Canvas.image.src = imageSource;
  Canvas.image.onload = Canvas.draw;
};

Canvas.draw = function(imageSource) {
  Canvas.canvas.width = Canvas.image.width;
  Canvas.canvas.height = Canvas.image.height;
  Canvas.context = Canvas.canvas.getContext('2d');
  Canvas.context.drawImage(Canvas.image, 0, 0);
  Canvas.pixels = Canvas.getPixels();
};

Canvas.getPixels = function(imageData) {
  var imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
  return {
    imageData: imageData,
    getIndex: function(x, y) {
      return (x + y * this.imageData.width) * 4;
    },
    getRGBA: function(x, y) {
      var index = this.getIndex(x, y);
      return {
        r: this.imageData.data[index + 0],
        g: this.imageData.data[index + 1],
        b: this.imageData.data[index + 2],
        a: this.imageData.data[index + 3]
      }
    },
    setRGBA: function(x, y, rgba) {
      var index = this.getIndex(x, y);
      this.imageData.data[index + 0] = rgba.r;
      this.imageData.data[index + 1] = rgba.g;
      this.imageData.data[index + 2] = rgba.b;
      this.imageData.data[index + 3] = rgba.a;
    },
    getWidth: function() {
      return this.imageData.width;
    },
    getHeight: function() {
      return this.imageData.height;
    }
  };
};

Canvas.redraw = function() {
  this.context.putImageData(this.pixels.imageData, 0, 0); // at coords 0,0
};

Canvas.applyFilter = function(filter, options) {
  if (options && options.restart) {
    this.draw(); 
  }
  filter(this.pixels);
  this.redraw();
};

Canvas.loadFile = function(file) {
  var fileReader = new FileReader();
  fileReader.onload = function() {
    Canvas.loadImage(fileReader.result);
  };
  fileReader.readAsDataURL(file);
};

