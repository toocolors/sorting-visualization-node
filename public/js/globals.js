// Script that stores global variables
// ************************************************************************************************
// Global Variables
// ************************************************************************************************
let array = [];
const arrayDiv = document.getElementById("arrayDiv");
let arraySize;
const maxSpeed = 1000;
let sortstate = -1; // -1 = stop/no sorting active, 0 = pause, 1 = step, 2 = play
let sorting = false;

// ************************************************************************************************
// Functions
// ************************************************************************************************
// helper function to use a setTimeout as a promise.
function allowUpdate() {
    // Get Speed
    let speed;
    if(!sorting || sortstate == 0) {
        speed = maxSpeed;
    } else {
        speed = Number(document.getElementById("speed").value);
    }

    return new Promise((f) => {
        setTimeout(f, 1000 - speed);
    });
}