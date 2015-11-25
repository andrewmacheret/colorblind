# colorblind
A mobile-friendly web-based Rubik's Cube with a built-in solver using [three.js](http://threejs.org/) and [jQuery](https://jquery.com/).

![Nature image](nature.jpg?raw=true "Nature image")

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
