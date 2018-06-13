# Software Fair Guide

**Available here: http://cs210.github.io/fair-guide/**

## Getting started

You can use either `yarn` or `npm`. The commands below should be identical.

Clone this repository and run

```
npm install
```

To run a development server on `localhost:8080`, run

```
npm run serve
```

To build a copy into the `docs/` folder, run

```
npm run build
```

### How building the Software Fair guide works

All the submissions are defined in `src/data/submissions.json`. If you have a CSV spreadsheet of submissions, you can customize the column names in `parser.py` and run that script on a CSV file to regenerate `src/data/submissions.json`. For example:

```
python3 parser.py src/data/2018_responses.csv
```

The naming in the guide and placement in the map of project categories is defined in `src/data/placement.json`.

An SVG map of Wallenberg is defined in `src/data/floorplan.svg`.

To generate the guide, `src/js/main.js` does a few things:

- it reads all these submissions, the placement file, and the floorplan.
- it renders the map by injecting the placement data into the appropriate areas on the SVG.
- it renders the fair guide entries by grouping all the submissions by their area, and then running each area through a handlebars template.
- finally, the script dumps the renders to an html file in `src/index.html`.

Visiting this `index.html` through any webserver will show a "mobile-friendly" guide. The guide is also print-friendly.

To generate new logos, you can install the Montserrat fonts (available online for free from Google Fonts and FontSquirrel) and add the updated year (e.g. "2018") on top of `banner_base.svg` or `banner_base.png` using the Montserrat Bold font, or simply change the year in `banner_template.svg` or `banner_template.ai` and export as an SVG with text converted to paths.
