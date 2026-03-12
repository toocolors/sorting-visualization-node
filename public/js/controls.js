// ************************************************************************************************
// Add Event Listeners
// ************************************************************************************************
document.getElementById("arraySize").addEventListener("input", (event) => {
    // Get arraySize text
    let text = event.target.value;
    
    // Check if value is empty (set it to empty in case it contains non-numbers)
    if(text == "") {
        event.target.value = "";
        return;
    }

    // Change text to a number
    text = Number(text);

    // Check if value in within bounds
    if(text < 1) {
        event.target.value = 1;
    } else if (text > document.getElementById("arrayDiv").clientHeight) {
        event.target.value = document.getElementById("arrayDiv").clientHeight;
    }
});

document.getElementById("play").addEventListener("click", () => {
    // Update sortstate
    sortstate = 2;
    if(!sorting) {
        beginSort();
    } else {
        disableButton("step");
        enableButton("pause");
    }
});

document.getElementById("step").addEventListener("click", () => {
    // Update sortstate
    sortstate = 1;
    if(!sorting) {
        beginSort();
    }
});

document.getElementById("pause").addEventListener("click", () => {
    // Update sortstate
    sortstate = 0;
    // Update Buttons
    enableButton("play");
    enableButton("step");
    disableButton("pause");
});

document.getElementById("stop").addEventListener("click", () => {
    // Update sortstate
    sortstate = -1;
    // Update Buttons
    disableButton("play");
    disableButton("step");
    disableButton("pause");
    disableButton("stop");
});

document.getElementById("unmute").addEventListener("click", (event) => {
    // resume audio
    audio.resume();

    // Disable unmute, enable mute
    event.target.classList.add("hide");
    document.getElementById("mute").classList.remove("hide");
});

document.getElementById("mute").addEventListener("click", (event) => {
    // resume audio
    audio.suspend();

    // Disable unmute, enable mute
    event.target.classList.add("hide");
    document.getElementById("unmute").classList.remove("hide");
});

// ************************************************************************************************
// Functions
// ************************************************************************************************

/**
 * Loops through the array while turning each element green. Clears colors after.
 */
async function arrayCompleteLoop() {
    // Enable/Disable Controls
    disableButton("play");
    disableButton("step");
    disableButton("pause");
    enableButton("stop");
    
    // Loop through array
    for(let i = 0; sortstate == 2 && i < arraySize; i++) {
        setComplete(i);
        await allowUpdate();
        playAudio(array[i]);
    }
    
    // Clear complete class
    clearClass("complete");
}

/**
 * Sorts the array using the currently selected sort.
 */
async function beginSort() {
    // Update sorting
    sorting = true;

    // Enable/Disable Buttons
    disableButton("generate");
    enableButton("stop");
    if(sortstate == 2) { // play
        disableButton("play");
        disableButton("step");
        enableButton("pause");
    }
    
    // Start Sort
    for(let i = 0; i < sortList.length; i++) {
        if(sortList[i][0] === document.getElementById("sortSelect").value) {
            await sortList[i][2]();
        }
    }

    // Clear Cursors
    clearClass("cursor");

    // Loop through array to show completion
    if(sortstate == 2) {
        await arrayCompleteLoop();
    }

    // Enable/Disable Buttons
    enableButton("generate");
    enableButton("play");
    enableButton("step");
    disableButton("pause");
    disableButton("stop");
    
    // Reset sorting
    sorting = false;

    // Update Page
    allowUpdate();
}

/**
 * Hides the passed in button, and showes its grayed version.
 * @param {String} button The id of a button.
 */
function disableButton(button) {
    // Disable button
    document.getElementById(button).classList.add("hide");

    // Enable grayed button
    document.getElementById(`${button}Grayed`).classList.remove("hide");
}

/**
 * Shows the passed in button, and hides its grayed version.
 * @param {String} button The id of a button.
 */
function enableButton(button) {
    // Enable button
    document.getElementById(button).classList.remove("hide");

    // Disable grayed button
    document.getElementById(`${button}Grayed`).classList.add("hide");
}