// ************************************************************************************************
// Call Functions
// ************************************************************************************************
InitializeControls();

// ************************************************************************************************
// Add Event Listeners
// ************************************************************************************************
document.getElementById("arraySize").addEventListener("input", (event) => {
    // Get arraySize text
    let text = event.target.value;

    // Check if value is empty (set it to empty in case it contains non-numbers)
    if (text == "") {
        event.target.value = "";
        return;
    }

    // Change text to a number
    text = Number(text);

    // Check if value in within bounds
    if (text < 1) {
        event.target.value = '';
    } else if (text > document.getElementById("arrayDiv").clientHeight) {
        event.target.value = document.getElementById("arrayDiv").clientHeight;
    }
});

document.getElementById("sortSelect").addEventListener("change", getOptions);

document.getElementById("play").addEventListener("click", () => {
    // Update sortstate
    sortstate = 2;
    if (!sorting) {
        beginSort();
    } else {
        disableButton("step");
        enableButton("pause");
    }
});

document.getElementById("step").addEventListener("click", () => {
    // Update sortstate
    sortstate = 1;
    if (!sorting) {
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

window.addEventListener("resize", changeWindowSize);

// ************************************************************************************************
// Functions
// ************************************************************************************************

/**
 * Adds an event listener for each algoLink a element that calls getScript.
 */
function addAlgoLinkEvents() {
    // Get Algorithm A Elements
    const links = document.querySelectorAll('.algoLink');
    for (let i = 0; i < links.length; i++) {
        links[i].addEventListener('click', (event) => {
            if (!event.target.classList.contains('currentAlgo')) {
                getScript(event.target);
            }
        })
    }
}

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
    for (let i = 0; sortstate == 2 && i < arraySize; i++) {
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
    if (sortstate == 2) { // play
        disableButton("play");
        disableButton("step");
        enableButton("pause");
    }

    // Start Sort
    for (let i = 0; i < currentAlgorithm.sortList.length; i++) {
        if (currentAlgorithm.sortList[i][0] === document.getElementById("sortSelect").value) {
            await currentAlgorithm.sortList[i][2]();
        }
    }

    // Clear Cursors
    clearClass("cursor");

    // Loop through array to show completion
    if (sortstate == 2) {
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

async function changeWindowSize() {
    // Update orientation
    switchOrientation();

    // Get Window Size
    let newSize = document.getElementById("arrayDiv").clientHeight;

    // Check if array is generated
    if (generated) {
        // Check if new size is smaller than the array
        if (arraySize > newSize) { // new size is smaller than array
            // End sorting
            await endSorting();

            // Reset generated
            generated = false;

            // Empty boxes
            arrayDiv.innerHTML = '';

            // Disable buttons
            disableButton('play');
            disableButton('step');
        } else { // new size is greater than or equal to array
            // Update box height and width
            const newWidth = Math.max(1, newSize / array.length);
            for (let i = 0; i < array.length; i++) {
                document.getElementById(`element${i}`).style.height = `
                ${Math.max(1, newSize / (array.length / array[i]))}px`;
                document.getElementById(`element${i}`).style.width = `${newWidth}px`;
            }
        }
    }

    // Bind Array Size Input
    const sizeInput = document.getElementById('arraySize');
    sizeInput.value = Math.min(Number(sizeInput.value), newSize);

    // Update Array Size Placeholder Text
    updateArraySizePlaceholder();

    // Allow page to update
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

/**
 * Fills sort selection based on the sort script's variables.
 */
async function fillSortSelect() {
    // Wait for currentAlgorithm
    while (currentAlgorithm === null) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Get sort select
    const sortSelect = document.getElementById("sortSelect");

    // Reset sort select
    for (let i = sortSelect.options.length - 1; i >= 0; i--) {
        sortSelect.remove(i);
    }

    // Fill sort select
    for (let i = 0; i < currentAlgorithm.sortList.length; i++) {
        // Create Option
        let option = document.createElement("option");
        option.value = currentAlgorithm.sortList[i][0];
        option.innerHTML = currentAlgorithm.sortList[i][1];

        // Add Option
        sortSelect.add(option);
    }
}

/**
 * Attempts to get the partial EJS file for the current algorithm.
 * @param {String} algoName The id of the algorithm.
 */
async function getInfo(algoName) {
    // Get information div
    const infoDiv = document.getElementById('information');

    // Try to fetch info ejs
    try {
        const response = await fetch(`/get/info?id=${algoName}`);
        infoDiv.innerHTML = await response.text();
    } catch {
        infoDiv.innerHTML = '';
    }
}

/**
 * Attempts to fill the options div.
 * @param {Element} element The sort select.
 */
function getOptions() {
    // Get sort name and optionsDiv
    const sortId = document.getElementById('sortSelect').value;
    const optionsDiv = document.getElementById('optionsDiv');

    if (currentAlgorithm.optionsList === undefined ||
        currentAlgorithm.optionsList[sortId] === undefined) {
        // Empty optionsDiv
        optionsDiv.innerHTML = '';
    } else {
        // Fill optionsDiv
        optionsDiv.innerHTML = currentAlgorithm.optionsList[sortId];
    }
}

/**
 * Attempts to import a new algorithm script and update currentAlgorithm.
 * @param {HTML A Element} element The a element that was clicked.
 * @returns 
 */
async function getScript(element) {
    // Get algorithm name
    const algoName = element.id;

    // Disable Buttons
    disableButton('play');
    disableButton('step');
    disableButton('pause');
    disableButton('stop');

    // End sorting
    await endSorting();
    // Load Algorithm
    let module;
    try {
        module = await import(`/get/algorithm?id=${algoName}`);
    } catch {
        // Reset buttons and return
        if (generated) {
            enableButton('play');
            enableButton('step');
        }
        return;
    }

    /// Update currentAlgorithm
    currentAlgorithm = module;

    // Update current a element
    clearClass('currentAlgo');
    element.classList.add('currentAlgo');

    // Update sort select
    await fillSortSelect();

    // Update options
    getOptions();

    // Enable Buttons
    if (generated) {
        enableButton('play');
        enableButton('step');
    }

    // Get Information
    await getInfo(algoName);
}

/**
 * Calls a few functions to initialize certain control elements.
 */
async function InitializeControls() {
    await fillSortSelect();
    getOptions();
    addAlgoLinkEvents();
    updateArraySizePlaceholder();
    switchOrientation();
}

/**
 * Attempts to switch the page orientation to landscape/portrait.
 */
function switchOrientation() {
    // Get generation div, flexbox
    const generationDiv = document.getElementById("generation");
    const flexbox = document.getElementById("flexbox");

    if (viewType === "landscape" &&
        window.innerHeight > window.innerWidth) {
        // Switching to portrait
        // Update viewType
        viewType = "portrait";

        // Move generation div to vertical
        // document.getElementById("generationHorizontal").removeChild(generationDiv);
        // document.getElementById("generationVertical").addChild(generationDiv);
        document.getElementById("generationVertical").appendChild(generationDiv);

        // Update flexbox direction
        flexbox.style.flexDirection = "column";
    } else if (viewType === "portrait" &&
        window.innerWidth > window.innerHeight) {
        // Switching to landscape
        // Update viewType
        viewType = "landscape";

        // Move generation div to horizontal
        // document.getElementById("generationVertical").removeChild(generationDiv);
        // document.getElementById("generationHorizontal").addChild(generationDiv);
        document.getElementById("generationHorizontal").appendChild(generationDiv);

        // Update flexbox direction
        flexbox.style.flexDirection = "row";
    }
}

/**
 * Updates the placeholder of arraySize to '1 - arrayDiv height'.
 */
function updateArraySizePlaceholder() {
    document.getElementById('arraySize').placeholder = `1-${arrayDiv.clientHeight}`;
}