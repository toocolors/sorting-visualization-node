// ************************************************************************************************
// Script variables
// ************************************************************************************************
const insertion = await import("/get/algorithm?id=Insertion");
let insertionSize;
export const sortList = [ // 0 = id, 1 = name, 2 = main function
    ["merge", "Merge Sort", beginSort],
    ["in-place", "In-Place", beginSort]
];
export const optionsList = new Object();

// Options
// Default
optionsList["default"] = `
Insertion Threshold:
<input type='number' id='dualPivotOptions' value='0' min='0'>
`;
let pivotType;

// ************************************************************************************************
// Sorting Functions
// ************************************************************************************************
async function beginSort() {
    // Get options
    const options = getSortOptions();

    // Get and clamp insertion size
    insertionSize = parseInt(options[1]);
    if (isNaN(insertionSize) || insertionSize < 0) {
        insertionSize = 0;
    } else if (insertionSize > array.length) {
        insertionSize = array.length - 1;
    }

    // Set insertionType
    insertion.setInsertionType("insert");

    // Begin Merge Sort
    switch (options[0]) {
        case "in-place":
            await naiveInPlace(0, array.length - 1);
            break;
        case "merge":
        default:
            await mergeSort(0, array.length);
            break;
    }
}

/**
 * Sorts a section of the array using In-Place Merge Sort.
 * @param {Number} start The start of the section to sort.
 * @param {Number} end The end of the section to sort (including).
 * @returns True to keep sorting, False to stop sorting.
 */
async function naiveInPlace(start, end) {
    // End recursion if section is empty or one element
    if (start >= end) {
        return true;
    }

    // Do Insertion Sort on section if section is smaller than threshold
    if (end - start <= insertionSize) {
        return await insertion.insertionSort(start, end);
    }

    // Get middle
    let middle = Math.floor((end + start) / 2);

    // Run recursive functions
    if(!await naiveInPlace(start, middle) || !await naiveInPlace(middle + 1, end)) {
        return false;
    }

    // Initialize indices
    let left = start;
    let right = middle + 1;

    // Set Cursors
    setCursor(left, "red");
    setCursor(right, "blue");

    // Merge left and right sections
    while(left <= middle && right <= end) {
        // Increment left index if left element is not greater than right element
        if(isEqualOrLess(left, right)) {
            // Clear cursor
            clearCursor(left);

            // Increment left
            left++;

            // Update page
            setCursor(left, "red");
            if(!await startStep(-1, left)) {
                return false;
            }
        }

        else  {
            // Store element
            const temp = get(right);

            // Shift indices in left section to the right
            if(!await shift(left, middle)) {
                return false;
            }

            // Set element into gap
            set(left, temp);

            // Clear cursors
            clearCursor(left);
            clearCursor(right);

            // Increment indices
            left++;
            middle++;
            right++;

            // Update Page
            setCursor(left, "red");
            setCursor(right, "blue");
            if (!await startStep(-1, right)) {
                return false;
            }
        }
    }

    // Clear cursors
    clearCursor(left);
    clearCursor(right);

    return true;
}

/**
 * Sorts a section of the array using Merge Sort.
 * @param {Number} start The start of the section to sort.
 * @param {Number} end The end of the section to sort (excluding).
 * @returns A sorted subarray to coninue sorting, False to stop sorting.
 */
async function mergeSort(start, end) {
    // End recursion if section is empty or one element
    if (end - start <= 1) {
        return array.slice(start, end);
    }

    // Do Insertion Sort on section if section is smaller than threshold
    if (end - start <= insertionSize) {
        if (!await insertion.insertionSort(start, end - 1)) {
            return false;
        }
        // Return section
        return array.slice(start, end);
    }

    // Call recursive functions
    const middle = start + Math.floor((end - start) / 2);
    // Run Merge Sort on left half of section.
    const left = await mergeSort(start, middle);
    if (left === false) {
        return false;
    }

    // Run Merge Sort on right half of section.
    const right = await mergeSort(middle, end);
    if (right === false) {
        return false;
    }

    // Sort section and build sorted array
    const arr = [];
    let l = 0; // Iterator for left
    let r = 0; // Iterator for right
    setCursor(start + l);
    setCursor(middle + r);
    for (let i = 0; i < end - start; i++) {
        // Try to get element from left
        if (l < left.length && (r >= right.length || left[l] <= right[r])) {
            // Write left element to arr, increment l, update left cursor
            arr.push(left[l]);
            clearCursor(start + l);
            l++;

            // Increment operations
            incrementOperation("reads", 3);
            incrementOperation("writes");
            incrementOperation("comparisons");

            // Update Page
            if(!await startStep(start + l)) {
                return false;
            }
        }
        // Try to get element from right
        else if (r < right.length) {
            // Write right element to arr, increment r
            arr.push(right[r]);
            clearCursor(middle + r);
            r++;

            // Increment operations
            incrementOperation("reads", 3);
            incrementOperation("writes");
            incrementOperation("comparisons");

            // Update Page
            if(!await startStep(middle + r)) {
                return false;
            }
        }
    }

    // Clear cursors
    clearCursor(start + l);
    clearCursor(middle + r);

    // Write array to current segment for visualization
    for(let i = 0; i < arr.length; i++) {
        // Write element i to array segment
        set(start + i, arr[i], false);

        // Update page
        if(!await startStep(start + i)) {
            return false;
        }
        clearCursor(start + i);
    }

    // Return arr
    return arr;
}

// ************************************************************************************************
// Helper Functions
// ************************************************************************************************

/**
 * Shifts all elements from start to end to the right.
 * @param {Number} start The start of the section to shift.
 * @param {Number} end The end of the section to shift (including).
 * @returns True to continue sorting, False to stop sorting.
 */
async function shift(start, end) {
    for(let i = end; i >= start; i--) {

        // Set element i to element i - 1
        set(i + 1, get(i));

        // Update page
        setCursor(i, "green");
        if (!await startStep(-1, i)) {
            return false;
        }
        clearCursor(i);
    }

    return true;
}