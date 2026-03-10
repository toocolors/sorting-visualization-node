// Add Event Listeners
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
});
document.getElementById("step").addEventListener("click", () => {
    // Update sortstate
    sortstate = 1;
});
document.getElementById("pause").addEventListener("click", () => {
    // Update sortstate
    sortstate = 0;
});
document.getElementById("stop").addEventListener("click", () => {
    // Update sortstate
    sortstate = -1;
});

// Functions
function enableGeneration() {
    // Enable generateEnabled
    document.getElementById("generateEnabled").classList.remove("hide");

    // Disable generateDisabled
    document.getElementById("generateDisabled").classList.add("hide");
}

function enableSort() {
    // Enable sortEnabled
    document.getElementById("sortEnabled").classList.remove("hide");

    // Disable sortDisabled
    document.getElementById("sortDisabled").classList.add("hide");
}

function disableGeneration() {
    // Disable generateEnabled
    document.getElementById("generateEnabled").classList.add("hide");

    // Enable generateDisabled
    document.getElementById("generateDisabled").classList.remove("hide");
}

function disableSort() {
    // Disable sortEnabled
    document.getElementById("sortEnabled").classList.add("hide");

    // Enable sortDisabled
    document.getElementById("sortDisabled").classList.remove("hide");
}