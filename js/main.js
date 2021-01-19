const MAX_LIGHT = 1260;
const SOFT_CAP = 1250;

let equipmentLevels = [];
let equipmentObjDict = {};
let charObj;
let equipmentObj;

// const characterList = document.getElementById("character-list");
// const inventory = document.getElementById("inventory");
const overLevel = document.getElementById("over-level-message");
const lightLevel = document.getElementById("character-stats");
const summary = document.getElementById("summary");
// const helmet = document.getElementById("helmet-light");
// const kinetic = document.getElementById("kinetic-light");
// const arm = document.getElementById("arm-light");
// const energy = document.getElementById("energy-light");
// const chest = document.getElementById("chest-light");
// const power = document.getElementById("power-light");
// const leg = document.getElementById("leg-light");
// const artifact = document.getElementById("artifact-light");
// const classItem = document.getElementById("class-light");

const lightInputs = document.getElementsByClassName("light-input");
const artifactInput = document.getElementById("artifact-light");

function calcLevel() {
    let itemLevels = [];
    let avgLevel = 0;
    let valueOverMax = false;

    for (let i = 0; i < lightInputs.length; i++) {
        if (typeof lightInputs[i].value !== "undefined") {
            if (parseFloat(lightInputs[i].value) > MAX_LIGHT) {
                valueOverMax = true;
            }
            itemLevels.push(parseFloat(lightInputs[i].value));
            avgLevel += parseFloat(lightInputs[i].value);
        }
    }

    avgLevel = avgLevel / itemLevels.length;

    if (valueOverMax) {
        overLevel.innerHTML = `
        <p class="error-message">One or more values are set above the current max light level of ${MAX_LIGHT}</p>
        `;
    }
    else {
        overLevel.innerHTML = '';
    }

    lightLevel.innerHTML = `
    <p id="light-level"><strong>BPL: ${Math.trunc(avgLevel)}</strong></p>
    <p><strong>With Artifact: ${Math.trunc(avgLevel + parseFloat(artifactInput.value))}</strong></p>
    `;

}