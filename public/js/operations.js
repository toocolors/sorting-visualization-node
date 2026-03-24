// ************************************************************************************************
// Array Access Functions
// ************************************************************************************************

/**
 * Creates a new element in array and arrayDiv.
 * @param {Number} index The index of the element.
 * @param {Number} value The value of the element.
 * @param {Number} width The width of the element.
 */
function createElement(index, value, width) {
    // Write Element
    array[index] = value;

    // Get element box height
    const height = Math.max(1, arrayDiv.clientHeight / (arraySize / value));

    // Add box on webpage
    arrayDiv.innerHTML += `<div
    id='element${index}'
    class='element' 
    style='height: ${height}px; width: ${width}px;'
    >
    </div>`;

    // Play Sound
    playAudio(value);
}

/**
 * Gets the element at the given index.
 * @param {Number} index The index of the array element to get.
 * @returns Returns the element at the index.
 */
function get(index) {
    return array[index];
}

/**
 * Writes the element at index to value and updates the corresponding box.
 * @param {Number} index The index of the array element to write.
 * @param {Number} value The value to write to the array.
 */
function set(index, value) {
    // Write element
    array[index] = value;

    // Update box
    document.getElementById(`element${index}`).style.height = `
        ${Math.max(1, arrayDiv.clientHeight / (arraySize / array[j]))}px`;
}

/**
 * Swaps the two elements at a and b and updates the corresponding boxes.
 * @param {Number} a An index of the array.
 * @param {Number} b An index of the array.
 */
function swap(a, b) {
    // Swap elements
    let temp = array[a];
    array[a] = array[b];
    array[b] = temp;

    // Update boxes
    document.getElementById(`element${a}`).style.height = `
        ${Math.max(1, arrayDiv.clientHeight / (arraySize / array[a]))}px`;
    document.getElementById(`element${b}`).style.height = `
        ${Math.max(1, arrayDiv.clientHeight / (arraySize / array[b]))}px`;
}

// ************************************************************************************************
// Comparison Functions
// ************************************************************************************************

/**
 * Checks if element a is equal to element b.
 * @param {Number} a An index of the array.
 * @param {Number} b An index of the array.
 * @returns true: a == b, false: a != b
 */
function isEqual(a, b) {
    return array[a] == array[b];
}

/**
 * Checks if element a is equal to or greater than element b.
 * @param {Number} a An index of the array.
 * @param {Number} b An index of the array.
 * @returns true: a == b, false: a != b
 */
function isEqualOrGreater(a, b) {
    return array[a] >= array[b]
}

/**
 * Checks if element a is greater than element b.
 * @param {Number} a An index of the array.
 * @param {Number} b An index of the array.
 * @returns true: a > b, false: a < b
 */
function isGreater(a, b) {
    return array[a] > array[b];
}

// ************************************************************************************************
// Helper Functions
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
 * Removes all elements in the passed in class.
 */
function clearClass(className) {
    let classElements = document.querySelectorAll(`.${className}`);
    for (let i = 0; i < classElements.length; i++) {
        classElements[i].classList.remove(className);
    }
}

/**
 * Removes the cursor class from the box at index.
 * @param {Number} index An array index.
 */
function clearCursor(index) {
    document.getElementById(`element${index}`).classList.remove("cursor");
}

/**
 * Ends the sorting algorithm.
 * Waits until sorting is false to return.
 */
async function endSorting() {
    // End sorting
    sortstate = -1;
    while (sorting) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}

function getWidth() {
    return Math.max(1, arrayDiv.clientWidth / arraySize);
}

function setComplete(index) {
    document.getElementById(`element${index}`).classList.add("complete");
}

/**
 * Sets the box at the listed array as a cursor.
 * @param {Number} index An array index.
 */
function setCursor(index) {
    document.getElementById(`element${index}`).classList.add("cursor");
}