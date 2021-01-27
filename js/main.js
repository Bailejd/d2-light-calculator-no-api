const MAX_LIGHT = 1260;     // Maximum Base Power Level this season
const SOFT_CAP = 1050;      // Technically this is a thing (1050 to 1200), could be the default for the page display
const HARD_CAP = 1200;      // "Hard Cap" starts here (1200 to 1250)
const PINNACLE_CAP = 1250;  // "Pinnacle Cap" starts here (1250 to 1260)

let equipmentLevels = [];
let equipmentObjDict = {};
let charObj;
let equipmentObj;

let itemLevels = [];
let basePowerLevel = 0;
let drops = [];

let myChart;
let chartDrawn = false;
let dropDiffs = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
];

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
    itemLevels = [];
    basePowerLevel = 0;
    let valueOverMax = false;

    for (let i = 0; i < lightInputs.length; i++) {
        if (typeof lightInputs[i].value !== "undefined") {
            if (parseFloat(lightInputs[i].value) > MAX_LIGHT) {
                valueOverMax = true;
            }
            itemLevels.push(parseFloat(lightInputs[i].value));
            basePowerLevel += parseFloat(lightInputs[i].value);
        }
    }

    basePowerLevel = basePowerLevel / itemLevels.length;

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
    <p id="light-level">${basePowerLevel.toFixed(2)}</p>
    <p id="label">With Artifact</p>
    <p id="light-level">${Math.trunc(basePowerLevel + parseFloat(artifactInput.value))}</p>
    `;

    basePowerLevel = Math.trunc(basePowerLevel);

    calcDrops();
}

function calcDrops() {
    // Calculate the power level of each type of drop at current Base Power Level
    drops = [0, 0, 0, 0, 0, 0, 0];

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

    calcChartData();
    //
    if (chartDrawn === false) {
        // calcChartData();
        drawChart();
        chartDrawn = true;
    }
    else {
        // updateChart();
        myChart.destroy();
        drawChart();
    }
}

function calcChartData() {
    // row=drop sources, col=item
    dropDiffs = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ];

    for (let i = 0; i < itemLevels.length; i++) {
        // Blue
        dropDiffs[0][i] = drops[0] - itemLevels[i];

        // Legendary
        dropDiffs[1][i] = drops[1] - itemLevels[i];

        // Powerful Tier 1
        dropDiffs[2][i] = drops[2] - itemLevels[i];

        // Powerful Tier 2
        dropDiffs[3][i] = drops[3] - itemLevels[i];

        // Powerful Tier 3
        dropDiffs[4][i] = drops[4] - itemLevels[i];

        // Pinnacle Weak
        dropDiffs[5][i] = drops[5] - itemLevels[i];

        // Pinnacle Strong
        dropDiffs[6][i] = drops[6] - itemLevels[i];
    }

    //
    //  Code for a different chart that is not in use currently
    //
    // If a more powerful source is equal to a weaker one, do not graph the more powerful source
    // for (let i = 0; i < dropDiffs[0].length; i++) {
    //     let temp = dropDiffs[0][i];

    //     for (let j = 1; j < dropDiffs.length; j++) {
    //         // dropDiffs[j][0] = dropDiffs[j][0] - temp;
    //         // Check j + 1
    //         // if (j + 1 < dropDiffs.length) {
    //         //     if (temp == dropDiffs[j + 1][0]) {
    //         //         dropDiffs[j + 1][i] = 0;
    //         //     }
    //         // }
    //         // check j
    //         if (temp == dropDiffs[j][i]) {
    //             dropDiffs[j][i] = 0;
    //         }
    //         else {
    //             temp = dropDiffs[j][i];
    //         }
    //     }
    // }

    // if (chartDrawn === true) {
    //     updateChart();
    // }
}

function updateChart() {
    myChart.destroy();
    drawChart();
}

function drawChart() {
    let data = {
        labels: ['Kinetic', 'Energy', 'Power', 'Helmet', 'Arms', 'Chest', 'Legs', 'Class'],
        datasets: [{
            label: 'Blue',
            backgroundColor: 'rgba(39, 125, 161, 1)',
            data: [dropDiffs[0][0], dropDiffs[0][1], dropDiffs[0][2], dropDiffs[0][3], dropDiffs[0][4], dropDiffs[0][5], dropDiffs[0][6], dropDiffs[0][7]]
        },
        {
            label: 'Legendary',
            backgroundColor: 'rgba(77, 144, 142, 1)',
            data: [dropDiffs[1][0], dropDiffs[1][1], dropDiffs[1][2], dropDiffs[1][3], dropDiffs[1][4], dropDiffs[1][5], dropDiffs[1][6], dropDiffs[1][7]]
        },
        {
            label: 'Powerful T1',
            backgroundColor: 'rgba(67, 170, 139, 1)',
            data: [dropDiffs[2][0], dropDiffs[2][1], dropDiffs[2][2], dropDiffs[2][3], dropDiffs[2][4], dropDiffs[2][5], dropDiffs[2][6], dropDiffs[2][7]]
        },
        {
            label: 'Powerful T2',
            backgroundColor: 'rgba(144, 190, 109, 1)',
            data: [dropDiffs[3][0], dropDiffs[3][1], dropDiffs[3][2], dropDiffs[3][3], dropDiffs[3][4], dropDiffs[3][5], dropDiffs[3][6], dropDiffs[3][7]]
        },
        {
            label: 'Powerful T3',
            backgroundColor: 'rgba(249, 199, 79, 1)',
            data: [dropDiffs[4][0], dropDiffs[4][1], dropDiffs[4][2], dropDiffs[4][3], dropDiffs[4][4], dropDiffs[4][5], dropDiffs[4][6], dropDiffs[4][7]]
        },
        {
            label: 'Pinnacle Weak',
            backgroundColor: 'rgba(248, 150, 30, 1)',
            data: [dropDiffs[5][0], dropDiffs[5][1], dropDiffs[5][2], dropDiffs[5][3], dropDiffs[5][4], dropDiffs[5][5], dropDiffs[5][6], dropDiffs[5][7]]
        },
        {
            label: 'Pinnacle Strong',
            backgroundColor: 'rgba(243, 114, 44, 1)',
            data: [dropDiffs[6][0], dropDiffs[6][1], dropDiffs[6][2], dropDiffs[6][3], dropDiffs[6][4], dropDiffs[6][5], dropDiffs[6][6], dropDiffs[6][7]]
        }]
    };

    let ctx = document.getElementById("myChart").getContext('2d');
    myChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            barValueSpacing: 5,
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        min: 0
                    }
                }]
            }
        }
    });

    //
    //  Code for a different chart that I might go back to once I get it working
    //
    // myChart = new Chart(ctx, {
    //     type: 'bar',
    //     data: {
    //         labels: ['Kinetic', 'Energy', 'Power', 'Helmet', 'Arms', 'Chest', 'Legs', 'Class'],
    //         datasets: [{
    //             label: 'gain from Blue',
    //             data: dropDiffs[0],
    //             backgroundColor: [
    //                 'rgba(54, 162, 235, 1)',
    //                 'rgba(54, 162, 235, 1)',
    //                 'rgba(54, 162, 235, 1)',
    //                 'rgba(54, 162, 235, 1)',
    //                 'rgba(54, 162, 235, 1)',
    //                 'rgba(54, 162, 235, 1)',
    //                 'rgba(54, 162, 235, 1)',
    //                 'rgba(54, 162, 235, 1)'
    //             ]
    //         }, {
    //             label: 'gain from Legendary',
    //             data: dropDiffs[1],
    //             backgroundColor: [
    //                 'rgba(255, 99, 132, 1)',
    //                 'rgba(255, 99, 132, 1)',
    //                 'rgba(255, 99, 132, 1)',
    //                 'rgba(255, 99, 132, 1)',
    //                 'rgba(255, 99, 132, 1)',
    //                 'rgba(255, 99, 132, 1)',
    //                 'rgba(255, 99, 132, 1)',
    //                 'rgba(255, 99, 132, 1)'
    //             ]
    //         }, {
    //             label: 'gain from Powerful T1',
    //             data: dropDiffs[2],
    //             backgroundColor: [
    //                 'rgba(255, 206, 86, 1)',
    //                 'rgba(255, 206, 86, 1)',
    //                 'rgba(255, 206, 86, 1)',
    //                 'rgba(255, 206, 86, 1)',
    //                 'rgba(255, 206, 86, 1)',
    //                 'rgba(255, 206, 86, 1)',
    //                 'rgba(255, 206, 86, 1)',
    //                 'rgba(255, 206, 86, 1)'
    //             ]
    //         }, {
    //             label: 'gain from Powerful T2',
    //             data: dropDiffs[2],
    //             backgroundColor: [
    //                 'rgba(75, 192, 192, 1)',
    //                 'rgba(75, 192, 192, 1)',
    //                 'rgba(75, 192, 192, 1)',
    //                 'rgba(75, 192, 192, 1)',
    //                 'rgba(75, 192, 192, 1)',
    //                 'rgba(75, 192, 192, 1)',
    //                 'rgba(75, 192, 192, 1)',
    //                 'rgba(75, 192, 192, 1)'
    //             ]
    //         }, {
    //             label: 'gain from Powerful T3',
    //             data: dropDiffs[2],
    //             backgroundColor: [
    //                 'rgba(153, 102, 255, 1)',
    //                 'rgba(153, 102, 255, 1)',
    //                 'rgba(153, 102, 255, 1)',
    //                 'rgba(153, 102, 255, 1)',
    //                 'rgba(153, 102, 255, 1)',
    //                 'rgba(153, 102, 255, 1)',
    //                 'rgba(153, 102, 255, 1)',
    //                 'rgba(153, 102, 255, 1)'
    //             ]
    //         }, {
    //             label: 'gain from Pinnacle T1',
    //             data: dropDiffs[2],
    //             backgroundColor: [
    //                 'rgba(255, 159, 64, 1)',
    //                 'rgba(255, 159, 64, 1)',
    //                 'rgba(255, 159, 64, 1)',
    //                 'rgba(255, 159, 64, 1)',
    //                 'rgba(255, 159, 64, 1)',
    //                 'rgba(255, 159, 64, 1)',
    //                 'rgba(255, 159, 64, 1)',
    //                 'rgba(255, 159, 64, 1)'
    //             ]
    //         }, {
    //             label: 'gain from Pinnacle T2',
    //             data: dropDiffs[2],
    //             backgroundColor: [
    //                 'rgba(255, 206, 86, 1)',
    //                 'rgba(255, 206, 86, 1)',
    //                 'rgba(255, 206, 86, 1)',
    //                 'rgba(255, 206, 86, 1)',
    //                 'rgba(255, 206, 86, 1)',
    //                 'rgba(255, 206, 86, 1)',
    //                 'rgba(255, 206, 86, 1)',
    //                 'rgba(255, 206, 86, 1)'
    //             ]
    //         }]
    //     },
    //     options: {
    //         title: {
    //             display: true,
    //             text: 'Title of chart'
    //         },
    //         tooltips: {
    //             mode: 'index',
    //             intersect: false
    //         },
    //         responsive: true,
    //         maintainAspectRatio: false,
    //         scales: {
    //             xAxes: [{
    //                 stacked: true
    //             }],
    //             yAxes: [{
    //                 stacked: true,
    //                 ticks: {
    //                     beginAtZero: true
    //                 }
    //             }]
    //         }
    //     }
    // });
}