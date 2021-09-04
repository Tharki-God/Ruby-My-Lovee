/* eslint-disable no-undef */
var percentageElement = document.getElementById("percentage");
var percentage = 0;

function process() {
    percentage += parseInt(Math.random() * 5);
    if (percentage > 100) {
        percentage = 100;
    }
    percentageElement.innerText = percentage;
    processInterval();
}

function processInterval() {
    setTimeout(process, Math.random() * (1000 - 500) + 500);
}
processInterval();