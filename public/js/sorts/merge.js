// ************************************************************************************************
// Script variables
// ************************************************************************************************
const insertion = await import("/get/algorithm?id=Insertion");
let insertionSize;
export const sortList = [ // 0 = id, 1 = name, 2 = main function
    ["merge", "Merge Sort", beginSort]
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

    // Begin Merge Sort
    switch (options[0]) {
        case "merge":
        default:
            await mergeSort(0, array.length);
            break;
    }
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
    for (let i = 0; i < end - start; i++) {
        // Try to get element from left
        if (l < left.length && (r >= right.length || left[l] <= right[r])) {
            // Write left element to arr, increment l
            arr.push(left[l]);
            set(start + i, left[l]);
            l++;
        }
        // Try to get element from right
        else if (r < right.length) {
            // Write right element to arr, increment r
            arr.push(right[r]);
            set(start + i, right[r]);
            r++;
        }
    }

    // Return arr
    console.log("Returning " + arr);
    return arr;
}