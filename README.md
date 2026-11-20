# colorblind

[![Deploy](https://github.com/andrewmacheret/colorblind/actions/workflows/deploy.yml/badge.svg)](https://github.com/andrewmacheret/colorblind/actions/workflows/deploy.yml) [![License](https://img.shields.io/badge/license-MIT-lightgray.svg)](https://github.com/andrewmacheret/colorblind/blob/master/LICENSE.md)

A web-based color blindness simulator, in plain JavaScript with an HTML canvas. No libraries.

See it running at [https://andrewmacheret.com/projects/colorblind/](https://andrewmacheret.com/projects/colorblind/).

![Nature image](www/nature.jpg?raw=true "Nature image")

## Run it locally

```
cd www
python3 -m http.server
```

Then open [http://localhost:8000](http://localhost:8000). You should see a test image and a lot of buttons, and those buttons should change the appearance of the image.

## Deploy

Pushing to `master` runs [GitHub Actions](.github/workflows/deploy.yml), which syncs `www/` to `s3://andrewmacheret.com/projects/colorblind` and clears the CloudFront cache. It signs in to AWS with GitHub OIDC using the role in the `AWS_ROLE_ARN` repo variable.
