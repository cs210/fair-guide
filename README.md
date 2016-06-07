# Software Fair Guide

**Available here: http://cs210.github.io/fair-guide/**

## Getting started

Clone this repository and run

```
npm install
```

To run a development server on `localhost:8080`, run

```
npm run serve
```

To build a copy into the `dist/` folder, run

```
npm run build
```

### How building the Software Fair guide works

All the submissions are defined in `src/data/submissions.json`.

Their placement in the map is defined in `src/data/placement.json`.

An SVG map of Wallenberg is defined in `src/data/floorplan.svg`.

To generate the guide, `src/js/main.js` does a few things:

- it reads all these submissions, the placement file, and the floorplan.
- it renders the map by injecting the placement data into the appropriate areas on the SVG.
- it renders the fair guide entries by grouping all the submissions by their area, and then running each area through a handlebars template.
- finally, the script dumps the renders to an html file in `src/index.html`.

Visiting this `index.html` through any webserver will show a "mobile-friendly" guide. The guide is also print-friendly.
