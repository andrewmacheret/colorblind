'use strict';

(function() {
  // bigger photos get shrunk so filters stay quick
  var maxSide = 2000;

  var el = function(id) { return document.getElementById(id); };
  var viewer = el('viewer');
  var filteredCanvas = el('filtered');
  var originalCanvas = el('original');
  var divider = el('divider');
  var imageChoice = el('image-choice');
  var imageFile = el('image-file');
  // shows the name of an uploaded file in the picker, only added while one is loaded
  var ownImage = document.createElement('option');
  ownImage.value = '';
  var errorBox = el('error');
  var panel = el('filters');

  var state = {
    filter: Filters.find(location.hash.slice(1)) || Filters.normal,
    pixels: null,
    imageName: '',
    imageLabel: '',
    loadId: 0
  };

  var render = function() {
    var filter = state.filter;
    var comparing = filter !== Filters.normal;

    panel.querySelectorAll('[data-filter]').forEach(function(chip) {
      chip.setAttribute('aria-pressed', String(chip.dataset.filter === filter.id));
    });
    el('filter-name').textContent = filter.name;
    el('filter-about').textContent = filter.about;
    el('filter-tag').textContent = filter.name;
    viewer.classList.toggle('comparing', comparing);
    filteredCanvas.setAttribute('aria-label', state.imageLabel + (comparing ? ', as seen with ' + filter.name : ''));

    if (state.pixels) {
      filteredCanvas.getContext('2d').putImageData(Filters.apply(state.pixels, filter.matrix), 0, 0);
    }
  };

  var setFilter = function(filter) {
    // start the split in the middle each time a filter gets turned on
    if (state.filter === Filters.normal && filter !== Filters.normal) setSplit(50);
    state.filter = filter;
    history.replaceState(null, '', filter === Filters.normal ? location.pathname + location.search : '#' + filter.id);
    render();
  };

  var showError = function(message) {
    errorBox.textContent = message;
    errorBox.hidden = !message;
  };

  var loadImage = function(src, name, label, onDone) {
    var loadId = ++state.loadId;
    var image = new Image();
    image.onload = function() {
      if (onDone) onDone();
      // a newer image was picked while this one was loading
      if (loadId !== state.loadId) return;

      var scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
      var width = Math.max(1, Math.round(image.naturalWidth * scale));
      var height = Math.max(1, Math.round(image.naturalHeight * scale));
      [originalCanvas, filteredCanvas].forEach(function(canvas) {
        canvas.width = width;
        canvas.height = height;
      });
      var context = originalCanvas.getContext('2d');
      context.drawImage(image, 0, 0, width, height);

      state.pixels = context.getImageData(0, 0, width, height);
      state.imageName = name;
      state.imageLabel = label;
      viewer.style.setProperty('--ratio', width / height);
      viewer.classList.remove('empty');
      showError('');
      render();
    };
    image.onerror = function() {
      if (onDone) onDone();
      if (loadId !== state.loadId) return;
      showError('That file couldn\u2019t be opened as an image.');
    };
    image.src = src;
  };

  var loadSample = function() {
    var option = imageChoice.selectedOptions[0];
    ownImage.remove();
    imageFile.value = '';
    loadImage(option.value, option.value.replace(/\.\w+$/, ''), option.textContent);
  };

  var loadFile = function(file) {
    if (!file) return;
    if (!/^image\//.test(file.type)) {
      showError('That file isn\u2019t an image.');
      return;
    }
    var url = URL.createObjectURL(file);
    ownImage.textContent = file.name;
    imageChoice.appendChild(ownImage);
    imageChoice.value = '';
    loadImage(url, file.name.replace(/\.\w+$/, ''), file.name, function() {
      URL.revokeObjectURL(url);
    });
  };

  // the split between the original (left) and the filtered image (right)

  var setSplit = function(percent) {
    var split = Math.round(Math.max(0, Math.min(100, percent)));
    viewer.style.setProperty('--split', split + '%');
    divider.setAttribute('aria-valuenow', split);
    divider.setAttribute('aria-valuetext', split + '% original');
  };

  var getSplit = function() {
    return Number(divider.getAttribute('aria-valuenow'));
  };

  var dragging = false;

  var splitFromPointer = function(event) {
    var rect = viewer.getBoundingClientRect();
    setSplit((event.clientX - rect.left) / rect.width * 100);
  };

  viewer.addEventListener('pointerdown', function(event) {
    if (!viewer.classList.contains('comparing') || event.button !== 0) return;
    // on touch screens only the handle drags, so swiping over the photo still scrolls the page
    if (event.pointerType !== 'mouse' && !divider.contains(event.target)) return;
    dragging = true;
    viewer.setPointerCapture(event.pointerId);
    viewer.classList.add('dragging');
    splitFromPointer(event);
    event.preventDefault();
    divider.focus({ preventScroll: true });
  });

  viewer.addEventListener('pointermove', function(event) {
    if (dragging) splitFromPointer(event);
  });

  var stopDragging = function() {
    dragging = false;
    viewer.classList.remove('dragging');
  };
  viewer.addEventListener('pointerup', stopDragging);
  viewer.addEventListener('pointercancel', stopDragging);

  divider.addEventListener('keydown', function(event) {
    var steps = { ArrowLeft: -5, ArrowDown: -5, ArrowRight: 5, ArrowUp: 5, PageDown: -25, PageUp: 25 };
    if (event.key in steps) {
      setSplit(getSplit() + steps[event.key]);
    } else if (event.key === 'Home') {
      setSplit(0);
    } else if (event.key === 'End') {
      setSplit(100);
    } else {
      return;
    }
    event.preventDefault();
  });

  panel.addEventListener('click', function(event) {
    var chip = event.target.closest('[data-filter]');
    if (chip) setFilter(Filters.find(chip.dataset.filter));
  });

  // loading images

  imageChoice.addEventListener('change', function() {
    if (imageChoice.value) loadSample();
  });

  imageFile.addEventListener('change', function() {
    loadFile(imageFile.files[0]);
  });

  document.addEventListener('dragover', function(event) {
    if (!event.dataTransfer || event.dataTransfer.types.indexOf('Files') === -1) return;
    event.preventDefault();
    document.body.classList.add('dropping');
  });

  document.addEventListener('dragleave', function(event) {
    // relatedTarget is empty once the drag leaves the window
    if (!event.relatedTarget) document.body.classList.remove('dropping');
  });

  document.addEventListener('drop', function(event) {
    document.body.classList.remove('dropping');
    if (!event.dataTransfer || !event.dataTransfer.files.length) return;
    event.preventDefault();
    loadFile(event.dataTransfer.files[0]);
  });

  document.addEventListener('paste', function(event) {
    var files = event.clipboardData ? event.clipboardData.files : [];
    if (files.length) {
      event.preventDefault();
      loadFile(files[0]);
    }
  });

  el('save').addEventListener('click', function() {
    if (!state.pixels) return;
    filteredCanvas.toBlob(function(blob) {
      var link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = state.imageName + (state.filter === Filters.normal ? '' : '-' + state.filter.id) + '.png';
      link.click();
      setTimeout(function() { URL.revokeObjectURL(link.href); }, 1000);
    }, 'image/png');
  });

  window.addEventListener('hashchange', function() {
    setFilter(Filters.find(location.hash.slice(1)) || Filters.normal);
  });

  setSplit(50);
  viewer.classList.add('empty');
  render();
  loadSample();
})();
