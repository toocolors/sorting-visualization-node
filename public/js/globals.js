// Script that stores global variables
// ************************************************************************************************
// Global Variables
// ************************************************************************************************
let array = [];
const arrayDiv = document.getElementById("arrayDiv");
let arraySize;
let sortstate = -1; // -1 = stop/no sorting active, 0 = pause, 1 = step, 2 = play
let sorting = false;

// ************************************************************************************************
// Functions
// ************************************************************************************************
// helper function to use a setTimeout as a promise.
function allowUpdate(speed = 1.0) {
    return new Promise((f) => {
        setTimeout(f, 1.0 - speed);
    });
}