// Script that stores global variables
// ************************************************************************************************
// Global Variables
// ************************************************************************************************
let array = [];
const arrayDiv = document.getElementById("visualization");
let arraySize;
const audio = new (window.AudioContext || window.webkitAudioContext)();
let maxHeight;
const elements = document.getElementsByClassName("element");
const gain = audio.createGain();
let generated = false;
let hasDeletion = false;
let maxArraySize;
const maxSpeed = 1000;
let viewType = "landscape";
let sorted;
let sortstate = -1; // -1 = stop/no sorting active, 0 = pause, 1 = step, 2 = play
const oscillator = audio.createOscillator();
let sorting = false;

// ************************************************************************************************
// Startup Code
// ************************************************************************************************
oscillator.connect(gain);
gain.connect(audio.destination);
gain.gain.value = 0.0;
oscillator.start();

// ************************************************************************************************
// Functions
// ************************************************************************************************

/**
 * Checks the current value of sortstate, then updates and/or returns a boolean.
 */
async function checkSortstate() {
    switch (sortstate) {
        case 2: // play
            return true;
        case 1: // step
            sortstate = 0;
            return true;
        case 0: // pause
            while (sortstate == 0) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            return checkSortstate();
        case -1: // stop
        default:
            return false;
    }
}

/**
 * Removes the cursor class from the box at index.
 * @param {Number} index An array index.
 * @param {String} color The color to clear from the element. Defaults to all colors.
 */
function clearCursor(index, color = "") {
    // Get color
    switch (color) {
        case "blue":
            color = "Blue";
            break;
        case "green":
            color = "Green";
            break;
        case "red":
            color = "Red";
            break;
        default:
            clearCursor(index, "blue");
            clearCursor(index, "green");
            clearCursor(index, "red");
            return;
    }

    // Remove cursor class
    elements[index].classList.remove(`cursor${color}`);
}

/**
 * Pauses the sorting algorithm to let the page update.
 */
function allowUpdate(speed = -1) {
    // Get Speed
    if (speed == -1) {
        if (!sorting || sortstate == 0) {
            speed = maxSpeed;
        } else if (document.getElementById("speed") !== null) {
            speed = Number(document.getElementById("speed").value);
        } else {
            speed = maxSpeed;
        }
    }

    return new Promise((f) => {
        setTimeout(f, 1000 - speed);
    });
}

/**
 * "Creates" a thread by updating algorithm threads and calling a function.
 * @param {Callable} sortFunction The function to call.
 * @param {Array} sortArgs The arguments to give the function.
 */
async function createThread(sortFunction, sortArgs) {
    let returnValue = false;
    try {
        returnValue = await sortFunction(...sortArgs);
    } finally {
        currentAlgorithm.threads++;
    }
    return returnValue;
}

/**
 * Attempts to get sort options.
 * @returns An array of: 
 *  1. The value of sortSelect
 *  2. The value of the select/input inside optionsDiv
 *  3. The value of threads count
 *  4. The value of threads size
 *  Values will be undefined if any options are unavailable.
 */
function getSortOptions() {
    // Check if sortOptions exists
    if (document.getElementById("sortOptions") === null) {
        return [undefined, undefined];
    }

    // Get sortSelect
    let sortValue = undefined;
    if (document.getElementById("sortSelect") !== null) {
        sortValue = document.getElementById("sortSelect").value;
    }

    // Get optionsDiv
    let optionsValue = undefined;
    if (document.querySelector("#optionsDiv select") !== null) {
        optionsValue = document.querySelector("#optionsDiv select").value;
    } else if (document.querySelector("#optionsDiv input") !== null) {
        optionsValue = document.querySelector("#optionsDiv input").value;
    }

    // Get threads variables
    let threadCount = 0;
    let threadSize = 0;
    if (currentAlgorithm.threads !== undefined) {
        // Thread Count
        threadCount = Math.floor(Number(document.getElementById("threadCount").value)) - 1;
        if (threadCount < 0) {
            threadCount = 0;
        }

        // Thread Size
        threadSize = Math.floor(Number(document.getElementById("threadSize").value));
        if (threadSize < 0) {
            threadSize = 0;
        }
    }

    // Return values
    return [sortValue, optionsValue, threadCount, threadSize];
}

/**
 * Plays audio based on value.
 * @param {Number} value The value of an array element. 
 */
function playAudio(value) {
    // Check if value is valid
    if (typeof value !== 'number') {
        value = 1;
    }

    // Get frequency
    let frequency
    frequency = 220 * Math.pow(2, value / maxHeight * 3);
    oscillator.frequency.value = frequency;
    oscillator.type = "sine"; // sine, square, triangle, sawtooth

    // Start Sound
    gain.gain.setValueAtTime(0.1, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.05);
}

/**
 * Sets the box at the listed array as a cursor.
 * @param {Number} index An array index.
 * @param {String} color The color to set the element to 
 * (blue, green, red). Defaults to red.
 */
function setCursor(index, color = "") {
    // Get color
    switch (color) {
        case "blue":
            color = "Blue";
            break;
        case "green":
            color = "Green";
            break;
        case "red":
        default:
            color = "Red";
            break;
    }

    // Update element at index
    elements[index].classList.add(`cursor${color}`);
}

/**
 * Checks sortstate, updates cursor, updates page, and plays audio.
 * @param {Number} index The index of an array element.
 * @param {*} isAudio true = play audio using index, false = do not play audio, Number = play audio using Number.
 */
async function startStep(index = -1, isAudio = true) {
    // Set index as cursor
    if (index >= 0) {
        setCursor(index);
    }

    // Check sortstate
    if (!await checkSortstate()) {
        return false;
    }

    // Update page
    await allowUpdate();

    // Play audio
    if (isAudio === true && index >= 0) {
        playAudio(array[index]);
    } else if (typeof isAudio === "number") {
        playAudio(array[isAudio]);
    }

    // Continue sorting
    return true;
}