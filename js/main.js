const MAX_LIGHT = 1260;     // Maximum Base Power Level this season
const SOFT_CAP = 1050;      // Technically this is a thing (1050 to 1200), could be the default for the page display
const HARD_CAP = 1200;      // "Hard Cap" starts here (1200 to 1250)
const PINNACLE_CAP = 1250;  // "Pinnacle Cap" starts here (1250 to 1260)

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

const dropBPL = document.getElementById("dropBPL");
const blueDropLevel = document.getElementById("blueDropLevel");
const legdDropLevel = document.getElementById("legdDropLevel");
const pow1DropLevel = document.getElementById("pow1DropLevel");
const pow2DropLevel = document.getElementById("pow2DropLevel");
const pow3DropLevel = document.getElementById("pow3DropLevel");
const pin1DropLevel = document.getElementById("pin1DropLevel");
const pin2DropLevel = document.getElementById("pin2DropLevel");

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
    <p id=label>Base Power Level:</p>
    <p id="light-level">${avgLevel.toFixed(2)}</p>
    <p id="label">With Artifact</p>
    <p id="light-level">${Math.trunc(avgLevel + parseFloat(artifactInput.value))}</p>
    `;

    calcDrops(Math.trunc(avgLevel));
}

function calcDrops(basePowerLevel) {
    // Calculate the power level of each type of drop at current Base Power Level
    let drops = [0, 0, 0, 0, 0, 0, 0];

    // Blue
    // I am not quite sure how blue drops work before 1200
    // For now it will always be BPL + 0
    drops[0] = basePowerLevel;

    // Legendary
    // I am not quite sure how legendary drops work before 1200
    // For now it will always be BPL + 0
    drops[1] = basePowerLevel;

    // Powerful Tier 1
    if (basePowerLevel < PINNACLE_CAP) {
        // I am not sure if drops while BPL is under a cap can drop over the cap since drop values change
        // For now drops over PINNACLE_CAP while BPL is under PINNACLE_CAP drop at PINNACLE_CAP
        if (basePowerLevel + 3 > PINNACLE_CAP) {
            drops[2] = PINNACLE_CAP;
        }
        else {
            drops[2] = basePowerLevel + 3;
        }
    }
    else {
        drops[2] = basePowerLevel;
    }

    // Powerful Tier 2
    if (basePowerLevel < PINNACLE_CAP) {
        // I am not sure if drops while BPL is under a cap can drop over the cap since drop values change
        // For now drops over PINNACLE_CAP while BPL is under PINNACLE_CAP drop at PINNACLE_CAP
        if (basePowerLevel + 4 > PINNACLE_CAP) {
            drops[3] = PINNACLE_CAP;
        }
        else {
            drops[3] = basePowerLevel + 4;
        }
    }
    else {
        drops[3] = basePowerLevel;
    }

    // Powerful Tier 3
    if (basePowerLevel < PINNACLE_CAP) {
        // I am not sure if drops while BPL is under a cap can drop over the cap since drop values change
        // For now drops over PINNACLE_CAP while BPL is under PINNACLE_CAP drop at PINNACLE_CAP
        if (basePowerLevel + 5 > PINNACLE_CAP) {
            drops[4] = PINNACLE_CAP;
        }
        else {
            drops[4] = basePowerLevel + 5;
        }
    }
    else {
        drops[4] = basePowerLevel;
    }

    // Pinnacle Weak
    if (basePowerLevel < PINNACLE_CAP) {
        if (basePowerLevel + 4 > PINNACLE_CAP) {
            drops[5] = PINNACLE_CAP;
        }
        else {
            drops[5] = basePowerLevel + 4;
        }
    }
    else {
        drops[5] = basePowerLevel + 1;
    }

    // Pinnacle Strong
    if (basePowerLevel < PINNACLE_CAP) {
        if (basePowerLevel + 5 > PINNACLE_CAP) {
            drops[6] = PINNACLE_CAP;
        }
        else {
            drops[6] = basePowerLevel + 5;
        }
    }
    else {
        drops[6] = basePowerLevel + 2;
    }

    // Update drop level table
    dropBPL.innerHTML = `Drop Levels at Base Power Level: ${basePowerLevel}`;
    blueDropLevel.innerHTML = drops[0];
    legdDropLevel.innerHTML = drops[1];
    pow1DropLevel.innerHTML = drops[2];
    pow2DropLevel.innerHTML = drops[3];
    pow3DropLevel.innerHTML = drops[4];
    pin1DropLevel.innerHTML = drops[5];
    pin2DropLevel.innerHTML = drops[6];
}