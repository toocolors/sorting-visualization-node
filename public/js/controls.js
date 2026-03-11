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

// ************************************************************************************************
// Functions
// ************************************************************************************************
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
    await bubbleSort();

    // Enable/Disable Buttons
    enableButton("generate");
    enableButton("play");
    enableButton("step");
    disableButton("pause");
    disableButton("stop");
    
    // Reset sorting
    sorting = false;

    // Update Page
    clearCursors();
    allowUpdate();
}

function enableButton(button) {
    // Enable button
    document.getElementById(button).classList.remove("hide");

    // Disable grayed button
    document.getElementById(`${button}Grayed`).classList.add("hide");
}

function disableButton(button) {
    // Disable button
    document.getElementById(button).classList.add("hide");

    // Enable grayed button
    document.getElementById(`${button}Grayed`).classList.remove("hide");
}