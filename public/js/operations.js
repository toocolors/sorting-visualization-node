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
    // Add box on webpage
    const el = document.createElement("div");
    el.id = `element${index}`;
    el.className = "element";
    arrayDiv.appendChild(el);

    // Write Element
    set(index, value);

    // Play Sound
    playAudio(value);
}

/**
 * Gets the element at the given index.
 * @param {Number} index The index of the array element to get.
 * @returns Returns the element at the index.
 */
function get(index) {
    incrementOperation("reads");
    return array[index];
}

/**
 * Removes an array element and its associated element.
 * @param {Number} index The index of the array element to remove.
 */
function remove(index) {
    // Delete Element
    incrementOperation("writes");
    array.splice(index);

    // Remove Box
    elements[index].remove();
}

/**
 * Writes the element at index to value and updates the corresponding box.
 * @param {Number} index The index of the array element to write.
 * @param {Number} value The value to write to the array.
 */
function set(index, value) {
    // Write element
    incrementOperation("writes");
    array[index] = value;

    // Update box
    elements[index].style.height = `
        ${(value / arraySize) * 100}%`;
}

/**
 * Swaps the two elements at a and b and updates the corresponding boxes.
 * @param {Number} a An index of the array.
 * @param {Number} b An index of the array.
 */
function swap(a, b) {
    // Swap elements
    const temp = get(a);
    set(a, get(b));
    set(b, temp);
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
    incrementOperation("comparisons");
    return get(a) == get(b);
}

/**
 * Checks if element a is equal to or greater than element b.
 * @param {Number} a An index of the array.
 * @param {Number} b An index of the array.
 * @returns true: a == b, false: a != b
 */
function isEqualOrGreater(a, b) {
    incrementOperation("comparisons");
    return get(a) >= get(b);
}

/**
 * Checks if element a is greater than element b.
 * @param {Number} a An index of the array.
 * @param {Number} b An index of the array.
 * @returns true: a > b, false: a < b
 */
function isGreater(a, b) {
    incrementOperation("comparisons");
    return get(a) > get(b);
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
    elements[index].classList.remove("cursor");
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

/**
 * Increments the passed in operation by 1.
 * @param {String} operation The name of an operation (without 'Span').
 */
function incrementOperation(operation) {
    const current = Number(document.getElementById(`${operation}Span`).innerHTML);
    document.getElementById(`${operation}Span`).innerHTML = current + 1;
    if(operation === "reads" || operation === "writes") {
        incrementOperation("accesses");
    }
}

async function regenerateArray() {
    // Pause Sorting
    let wasSorting = false;
    if(sorting) {
        switch(sortstate) {
            case 2:
                wasSorting = true;
                break;
            case 1:
            case 0:
                sortstate = 0;
                await allowUpdate();
                break;
            case -1:
            default:
                await endSorting();
                break;
        }
    }

    // Reset visualization
    arrayDiv.innerHTML = '';

    await allowUpdate();

    // Calculate width
    const width = getWidth();

    // Copy temp
    for(let i = 0; i < arraySize; i++) {
        createElement(i, array[i], width);
    }

    // Resume Sorting
    if(wasSorting) {
        sortstate = 2;
    }
}

/**
 * Resets operation count spans to 0.
 */
function resetOperationCounts() {
    document.getElementById("accessesSpan").innerHTML = 0;
    document.getElementById("comparisonsSpan").innerHTML = 0;
    document.getElementById("readsSpan").innerHTML = 0;
    document.getElementById("writesSpan").innerHTML = 0;
}

/**
 * Sets the element at index as complete.
 * @param {Number} index An array index.
 */
function setComplete(index) {
    elements[index].classList.add("complete");
}

/**
 * Sets the box at the listed array as a cursor.
 * @param {Number} index An array index.
 */
function setCursor(index) {
    elements[index].classList.add("cursor");
}