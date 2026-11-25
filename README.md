# colorblind

[![Deploy](https://github.com/andrewmacheret/colorblind/actions/workflows/deploy.yml/badge.svg)](https://github.com/andrewmacheret/colorblind/actions/workflows/deploy.yml) [![Canary](https://github.com/andrewmacheret/colorblind/actions/workflows/canary.yml/badge.svg)](https://github.com/andrewmacheret/colorblind/actions/workflows/canary.yml) [![License](https://img.shields.io/badge/license-MIT-lightgray.svg)](https://github.com/andrewmacheret/colorblind/blob/master/LICENSE.md)

A web-based color blindness simulator, in plain JavaScript with an HTML canvas. No libraries.

See it running at [https://andrewmacheret.com/projects/colorblind/](https://andrewmacheret.com/projects/colorblind/).

![Screenshot](www/screenshot.png?raw=true "Screenshot")

Pick a sample photo or load your own (button, drag and drop, or paste), then pick a type of color blindness. Drag the slider to compare with the original, and save the result as a PNG. Each filter is a 3x3 color matrix in [`www/filters.js`](www/filters.js), applied in linear RGB, and the page URL remembers the filter, like `#deuteranopia`. The red-green and blue-yellow simulations use the matrices from [Machado, Oliveira and Fernandes (2009)](https://www.inf.ufrgs.br/~oliveira/pubs_files/CVD_Simulation/CVD_Simulation.html), at 100% severity for the "-opia" types and 60% for the "-anomaly" types.

## Run it locally

```
cd www
python3 -m http.server
```

Then open [http://localhost:8000](http://localhost:8000). You should see a photo with filter buttons next to it, and the buttons should change how the photo looks. The dropdown switches between the sample images in `www/`.

## Health check

Once a day, the Canary workflow (`.github/workflows/canary.yml`) checks the page and its scripts and styles. It's started by [andrewmacheret/canary](https://github.com/andrewmacheret/canary).

## Deploy

Pushing to `master` runs [GitHub Actions](.github/workflows/deploy.yml), which syncs `www/` to `s3://andrewmacheret.com/projects/colorblind` and clears the CloudFront cache. It signs in to AWS with GitHub OIDC using the role in the `AWS_ROLE_ARN` repo variable.
