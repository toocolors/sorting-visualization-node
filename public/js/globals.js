// Script that stores global variables
// ************************************************************************************************
// Global Variables
// ************************************************************************************************
let array = [];
const arrayDiv = document.getElementById("visualization");
let arraySize;
const audio = new (window.AudioContext || window.webkitAudioContext)();
let containerHeight;
const elements = document.getElementsByClassName("element");
const gain = audio.createGain();
let generated = false;
let maxArraySize;
const maxSpeed = 1000;
let viewType = "landscape";
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
 * Pauses the sorting algorithm to let the page update.
 */
function allowUpdate() {
    // Get Speed
    let speed;
    if (!sorting || sortstate == 0) {
        speed = maxSpeed;
    } else {
        speed = Number(document.getElementById("speed").value);
    }

    return new Promise((f) => {
        setTimeout(f, 1000 - speed);
    });
}

/**
 * Plays audio based on value.
 * @param {Number} value The value of an array element. 
 */
function playAudio(value) {
    // Get frequency
    const frequency = 220 * Math.pow(2, value / arraySize * 3);
    oscillator.frequency.value = frequency;
    oscillator.type = "sine"; // sine, square, triangle, sawtooth

    // Start Sound
    gain.gain.setValueAtTime(0.1, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.05);
}