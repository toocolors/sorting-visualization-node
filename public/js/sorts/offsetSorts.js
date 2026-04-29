// ************************************************************************************************
// Sort Functions
// ************************************************************************************************

/**
 * Sorts a portion of the array using Bubble Sort.
 * @param {Number} start The first index of the section to sort.
 * @param {Number} end The last index of the section to sort.
 * @param {Number} increment The value to increment by each loop.
 * @returns True to continue sorting, False to stop sorting
 */
export async function bubbleSort(start, end, increment) {
    let threadSorted = false;
    for (let i = start; !threadSorted && i <= end; i += increment) {
        // Reset sorted
        threadSorted = true;

        // Loop through array
        for (let j = start + increment; j <= end - i + start; j += increment) {
            // Set cursors and update page
            setCursor(j);
            if (!await startStep(j - increment)) {
                return false;
            }

            // Swap elements and update page if out of order
            if (isGreater(j - increment, j)) {
                // Swap element
                swap(j - increment, j);

                // Update threadSorted
                threadSorted = false;

                // Update page
                if (!await startStep(j)) {
                    return false;
                }
            }

            // Clear cursors
            clearCursor(j);
            clearCursor(j - increment);
        }
    }

    return true;
}

/**
 * Sorts a portion of the array using Insertion Sort.
 * @param {Number} start The start of the section to sort.
 * @param {Number} end The end of the section to sort (including).
 * @param {Number} increment The amount to increment by when moving to the next element.
 * @param {Number} insertIncrement The amount to decrement by when inserting the current element.
 * @returns True to continue sorting, False to stop sorting.
 */
export async function insertionSort(start, end, increment, insertDecrement) {
    // Outer Loop
    for (let i = start + increment; i <= end; i += increment) {
        // Start Step
        if (!await startStep(i)) {
            return false;
        }

        // Loop until element is in place
        let index = i;
        while (index - insertDecrement >= start && isGreater(index - insertDecrement, index)) {
            // Swap Elements
            swap(index - insertDecrement, index);

            // Update Page
            setCursor(index - insertDecrement);
            if (!await startStep(index)) {
                return false;
            }
            clearCursor(index);
            clearCursor(index - insertDecrement);

            // Decrement index
            index -= insertDecrement;
        }

        // End Step
        clearCursor(i);
    }

    return true;
}

/**
 * Sorts a portion of the array using Selection Sort.
 * @param {Number} start The beginning index of the section to sort.
 * @param {Number} end The last index of the section to sort.
 * @param {Number} increment The value to increment by each loop iteration.
 * @returns True to continue sorting, False to stop sorting.
 */
export async function selectionSort(start, end, increment) {
    // Outer Loop
    for (let i = start; i <= end; i += increment) {
        // Initialize Smallest
        let smallest = i;

        // Inner Loop - Get Smallest Element
        for (let j = i + increment; j <= end; j += increment) {
            // Update page
            if (!await startStep(j)) {
                return false;
            }
            clearCursor(j);

            if (isLess(j, smallest)) {
                smallest = j;
            }
        }

        // Update page
        if (!await startStep(i)) {
            return false;
        }

        // Swap Smallest
        swap(i, smallest);

        // Update page
        if (!await startStep(i)) {
            return false;
        }
        clearCursor(smallest);
        clearCursor(i);
    }
}
