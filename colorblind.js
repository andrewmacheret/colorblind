$(window).load(function() {
  
  $('#reset').click(function() {
    Canvas.applyFilter(function() {}, {restart: true});
    console && console.log('reset applied');
  });

  // For all filters that have 1 argument, attach it to a button with the same id that performs that filter
  for (var property in Filters) {
    (function() {
      if (Filters.hasOwnProperty(property)) {
        var fn = Filters[property];
        if (typeof fn === 'function' && fn.length == 1) {
          $('#' + property).click(function() {
            Canvas.applyFilter(fn, {restart: true});
            console && console.log('Filter ' + property + ' applied');
          });
        }
      }
    })();
  }

  $('#image-file').change(function() {
    if (typeof window.FileReader !== 'function') {
      alert('The file API isn\'t supported on the current browser.');
      return;
    }

    var file = this.files[0];
    if (!file) {
      // no file selected
      return;
    }

    Canvas.loadFile(file);
  });


  var canvas = $('#canvas')[0];
  Canvas.init(canvas, canvas.getAttribute('init'));
});

