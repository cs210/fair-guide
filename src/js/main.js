const stylesheet = require('../styles/main.scss');
const dataUrl = require('../data/submissions.json');
const floorplanUrl = require('../data/floorplan.svg');
const placementUrl = require('../data/placement.json');
const sectionTemplate = require('../templates/fair-section.handlebars');
const submissionTemplate = require('../templates/fair-submission.handlebars');
const _ = require('lodash');

function getPlacements() {
    return fetch(placementUrl).then((response) => {
        return response.json();
    });
}

function generateGuideListings(placements) {
    const data = fetch(dataUrl);

    data.then((response) => {
        return response.json();
    }).then((json) => {
        const submissions = _.sortBy(json.submissions, (submission) => submission.project_name);
        const groups = _.groupBy(submissions, 'placement');

        let content = document.querySelector('.fair-guide');
        _.forIn(placements, (placementData, placementKey) => {
            const sectionData = {
                name: placementData.name,
                submissions: groups[placementKey].map((submission, index) =>
                    Object.assign({}, submission, { id: `${name}-${index}` }))
            };

            const sectionHtml = sectionTemplate(sectionData);

            content.insertAdjacentHTML('beforeend', sectionHtml);
        });
    });
}

function generateGuideMap(placements) {
    const floorplan = fetch(floorplanUrl).then((floorplan) => {
        return floorplan.text();
    }).then((floorplan) => {
        let floorplanContainer = document.createElement('div');
        floorplanContainer.innerHTML = floorplan;

        _.forIn(placements, (placementData, placementName) => {
            const { name, area } = placementData;
            let areasToProcess = [];
            if (!_.isArray(area)) {
                areasToProcess.push(area);
            } else {
                areasToProcess = areasToProcess.concat(area);
            }

            areasToProcess.forEach((area) => {
                const planArea = floorplanContainer.querySelector(`.${area}`);
                const planText = planArea.parentElement.querySelector('p');

                console.log(planArea);
                console.log(planText);

                planText.textContent = name;
            });
        });

        let content = document.querySelector('.fair-map');
        content.appendChild(floorplanContainer);
    });
}

document.addEventListener("DOMContentLoaded", function() {
    getPlacements().then((placements) => {
        generateGuideMap(placements);
        generateGuideListings(placements);
    });
});
