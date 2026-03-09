// ************************************************************************************************
// Array Access Functions
// ************************************************************************************************
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
 * Removes all elements in the cursor class.
 */
function clearCursors() {
    let previous = document.getElementsByClassName("cursor");
    for(let i = 0; i < previous.length; i++) {
        previous[i].classList.remove("cursor");
    }
}

/**
 * Sets the box at the listed array as a cursor.
 * @param {Number} index An array index.
 */
function setCursor(index) {
    document.getElementById(`element${index}`).classList.add("cursor");
}