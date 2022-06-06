const stylesheet = require('../styles/main.scss');
const dataUrl = require('../data/submissions.json');
const floorplanUrl = require('../data/floorplan.svg');
const placementUrl = require('../data/placement.json');
const icsFile = require('../data/2022-event-link.ics');
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
        
        // const groups = _.groupBy(submissions, 'placement');

        // Group by potentially multiple categories
        // TODO - clean up
        var groups = {};
        groups["All"] = []
        _.forIn(submissions, (submission) => {
            groups["All"].push(submission)
            _.forIn(submission.placement, (category) => {
                if (category in placements) {
                    if (category in groups) {
                        groups[category].push(submission)
                    } else {
                        groups[category] = [submission]
                    }
                }
            })
        });
        
        console.log(groups);

        let content = document.querySelector('.fair-guide');
        _.forIn(placements, (placementData, placementKey) => {
            if (placementKey in groups) {
                const name = placementData.name
                const sectionData = {
                    name,
                    submissions: placementKey in groups ? groups[placementKey].map((submission, index) =>
                        Object.assign({}, submission, { id: `${name}-${index}` })) : []
                };

                const sectionHtml = sectionTemplate(sectionData);

                content.insertAdjacentHTML('beforeend', sectionHtml);
            }
        });
    });
}

function generateGuideMap(placements) {
    const floorplan = fetch(floorplanUrl).then((floorplan) => {
        return floorplan.text();
    }).then((floorplan) => {
        let floorplanContainer = document.createElement('div');
        floorplanContainer.innerHTML = floorplan;

        _.forIn(placements.areas, (areaCategories, area) => {
            let categoriesToProcess = [];
            if (!_.isArray(areaCategories)) {
                categoriesToProcess.push(placements.categories[areaCategories].name);
            } else {
                categoriesToProcess = _.map(areaCategories, (category) => {
                    return placements.categories[category].name;
                });
            }
            const areaLabel = categoriesToProcess.join('; ');

            const planArea = floorplanContainer.querySelector(`.${area}`);
            const planText = planArea.parentElement.querySelector('p');

            console.log(planArea);
            console.log(planText);

            planText.textContent = areaLabel;
        });

        let content = document.querySelector('.fair-map');
        content.appendChild(floorplanContainer);
    });
}

document.addEventListener("DOMContentLoaded", function() {
    getPlacements().then((placements) => {
        generateGuideMap(placements);
        generateGuideListings(placements.categories);
    });
});
