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

  var imageChoice = document.getElementById('image-choice');
  var imageFile = document.getElementById('image-file');

  imageChoice.addEventListener('change', function() {
    // clear the file box so picking the same file again still works
    imageFile.value = '';
    Canvas.loadImage(imageChoice.value);
  });

  imageFile.addEventListener('change', function() {
    var file = this.files[0];
    if (!file) {
      // no file selected
      return;
    }

    Canvas.loadFile(file);
  });

  Canvas.init(document.getElementById('canvas'), imageChoice.value);
});
