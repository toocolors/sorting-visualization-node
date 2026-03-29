// ************************************************************************************************
// Array Access Functions
// ************************************************************************************************

/**
 * Creates a new element in array and arrayDiv.
 * @param {Number} index The index of the element.
 * @param {Number} value The value of the element.
 */
function createElement(index, value) {
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
    let removed = array.splice(index, 1);

    // Remove Box
    const el = elements[index];
    if (el) {
        el.remove();
    }

    // Update operations
    incrementOperation("writes", array.length - index);
    incrementOperation("reads", array.length - index);

    // Handle Deletion
    if (removed >= maxHeight) {
        hasDeletion = true;
        handleDeletions();
    }

    // Update arraySize
    arraySize = array.length;
}

/**
 * Iterates the element to be removed to the right edge
 * of the array, then deletes it.
 * @param {Number} index The index of the element to remove.
 */
async function removeSlowly(index) {
    // Store original value
    const originalValue = array[index];

    // Set value to zero
    set(index, 0, false);

    // Move elements over
    for (let i = index + 1; i < array.length; i++) {
        // Move element down
        set(i - 1, get(i));

        // Start Step
        if (sorting && !await startStep(i - 1)) {
            return false;
        }

        // End Step
        if (sorting) {
            clearCursor(i - 1);
        }
    }

    // Remove element at end of array
    set(array.length - 1, originalValue, false);
    remove(array.length - 1);

    // Go back to sorting
    return true;
}

/**
 * Writes the element at index to value and updates the corresponding box.
 * @param {Number} index The index of the array element to write.
 * @param {Number} value The value to write to the array.
 * @param {Boolean} updateOperation Whether to update writes operation.
 */
function set(index, value = null, updateOperation = true) {
    // Write element
    if (updateOperation) {
        incrementOperation("writes");
    }
    if (value === null) {
        value = array[index];
    } else {
        array[index] = value;
    }

    // Update box
    elements[index].style.height = `
        ${(value / maxHeight) * 100}%`;
}

/**
 * Sets an array element to zero and updates hasZero
 * @param {Number} index The index of the array element to set to zero.
 */
function setZero(index) {
    // Set element to zero
    hasDeletion = true;
    set(index, 0, false);

    // Get zeroes between index and array end
    let zeroCount = 0;
    for (let i = index + 1; i < array.length; i++) {
        if (array[i] < 1) {
            zeroCount++;
        }
    }

    // Update operations
    incrementOperation("writes", array.length - index - zeroCount);
    incrementOperation("reads", array.length - index - zeroCount);
}

/**
 * Shuffles the array from start to end.
 * @param {Number} start The start of the segment to shuffle.
 * @param {Number} end The end of the segment to shuffle.
 */
async function shuffleArray(start, end) {
    let count = end;
    if (end <= arraySize) {
        count = arraySize - 1;
    }
    let index;
    while (count >= start) {
        // Check sortstate
        if (sorting && !await checkSortstate()) {
            return false;
        }

        // Get random index
        index = Math.floor(Math.random() * count);

        // Swap elements
        swap(count, index);

        // Update page
        await allowUpdate();
        playAudio(count);
        playAudio(index);

        // Decrement Count
        count--;
    }

    return true;
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
 * @returns true: a >= b, false: a < b
 */
function isEqualOrGreater(a, b) {
    incrementOperation("comparisons");
    return get(a) >= get(b);
}

/**
 * Checks if element a is equal to or less than element b.
 * @param {Number} a An index of the array.
 * @param {Number} b An index of the array.
 * @returns true: a <= b, false: a > b
 */
function isEqualOrLess(a, b) {
    incrementOperation("comparisons");
    return get(a) <= get(b);
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

/**
 * Checks if element a is less than element b.
 * @param {Number} a An index of the array.
 * @param {Number} b An index of the array.
 * @returns true: a < b, false: a > b
 */
function isLess(a, b) {
    incrementOperation("comparisons");
    return get(a) < get(b);
}

// ************************************************************************************************
// Helper Functions
// ************************************************************************************************

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
 * @param {Number} increment The amount to increment by.
 */
function incrementOperation(operation, increment = 1) {
    // Check if operations div exists
    if (document.getElementById("operations") === undefined) {
        return;
    }

    const current = Number(document.getElementById(`${operation}Span`).innerHTML);
    document.getElementById(`${operation}Span`).innerHTML = current + increment;
    if (operation === "reads" || operation === "writes") {
        incrementOperation("accesses", increment);
    }
}

/**
 * Checks if the array is currently sorted.
 * @param {Number} start The start of the section to check.
 * @param {Number} end The end of the section to check (including).
 * @returns true = continue sorting, false = stop sorting
 */
async function isSorted(start, end) {
    // Reset Sorted
    sorted = true;

    // Clamp start and end
    if (start <= 0 || arraySize <= start) {
        start = 0;
    }
    if (end <= 0 || arraySize <= end) {
        end = arraySize - 1;
    }

    // Check if array section too small
    if (end - start < 1) {
        return true;
    }

    // Loop through array
    let last = 0;
    for (let i = start + 1; i <= end && i < array.length; i++) {
        // Check if element i is valid
        if (array[i] < 1) {
            continue;
        }

        // Start Step
        if (!await startStep(i, i)) {
            return false;
        }

        if (isGreater(last, i)) {
            clearCursor(i);
            sorted = false;
            return true;
        }

        // Update last
        last = i;

        // End Step
        clearCursor(i);
    }

    return true;
}

async function regenerateArray() {
    // Pause Sorting
    let wasSorting = false;
    if (sorting) {
        switch (sortstate) {
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
    for (let i = 0; i < arraySize; i++) {
        createElement(i, array[i], width);
    }

    // Resume Sorting
    if (wasSorting) {
        sortstate = 2;
    }
}

/**
 * Removes any elements with a value of less than 1 from the array.
 */
function handleDeletions() {
    if (!hasDeletion) {
        return;
    }

    // Loop through array
    let i = 0;
    let largest = 0;
    while (i < array.length) {
        // Check if element < 1
        if (array[i] < 1) {
            // Remove element
            array.splice(i, 1);
            elements[i].remove();
            continue;
        }

        // Check if element is largest so far
        if (array[i] > array[largest]) {
            largest = i;
        }

        // Increment i
        i++;
    }

    // Update Array Size
    arraySize = array.length;

    // Check if new largest is smaller than maxHeight
    let smaller = false;
    if (array[largest] < maxHeight) {
        smaller = true;
    }

    // Update maxHeight
    maxHeight = array[largest];

    // Update box heights
    if (smaller) {
        for (let i = 0; i < array.length; i++) {
            set(i, null, false);
        }
    }

    // Reset deletion trackers
    hasDeletion = false;
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