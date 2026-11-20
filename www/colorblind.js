window.addEventListener('load', function() {

  document.getElementById('reset').addEventListener('click', function() {
    Canvas.applyFilter(function() {}, {restart: true});
  });

  // For all filters that have 1 argument, attach it to a button with the same id that performs that filter
  Object.keys(Filters).forEach(function(property) {
    var fn = Filters[property];
    var button = document.getElementById(property);
    if (typeof fn === 'function' && fn.length == 1 && button) {
      button.addEventListener('click', function() {
        Canvas.applyFilter(fn, {restart: true});
      });
    }
  });

  document.getElementById('image-file').addEventListener('change', function() {
    var file = this.files[0];
    if (!file) {
      // no file selected
      return;
    }

    Canvas.loadFile(file);
  });

  var canvas = document.getElementById('canvas');
  Canvas.init(canvas, canvas.getAttribute('init'));
});
