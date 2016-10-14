# colorblind

[![Build Status](https://travis-ci.org/andrewmacheret/colorblind.svg?branch=master)](https://travis-ci.org/andrewmacheret/colorblind) [![License](https://img.shields.io/badge/license-MIT-lightgray.svg)](https://github.com/andrewmacheret/colorblind/blob/master/LICENSE.md)

A web-based color blindness simulator using WebGL, [jQuery](https://jquery.com/), and [math.js](http://mathjs.org/).

![Nature image](www/nature.jpg?raw=true "Nature image")

See it running at [http://andrewmacheret.com/projects/colorblind/](http://andrewmacheret.com/projects/colorblind/).

Prereqs:
* A web server (like [Apache](https://httpd.apache.org/)).

Installation steps:
* `git clone <clone url>`

Test it:
* Open `index.html` in a browser.
 * For testing purposes, if you don't have a web server, running `python -m SimpleHTTPServer` in the project directory and navigating to [http://localhost:8000](http://localhost:8000) should do the trick.
* You should see a test image and a lot of buttons, and those buttons should change the appearance of the image.
* To troubleshoot, look for javascript errors in the browser console.
