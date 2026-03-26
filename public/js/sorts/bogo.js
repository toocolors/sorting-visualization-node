// ************************************************************************************************
// Script variables
// ************************************************************************************************
let sorted;
export const sortList = [ // 0 = id, 1 = name, 2 = main function
    ["bogo", "Bogo Sort", bogoSort]
];

// ************************************************************************************************
// Sort Functions
// ************************************************************************************************

/**
 * Sorts the array using Bogo Sort.
 */
async function bogoSort() {
    // Loop through array
    sorted = false;
    while(!sorted) {
        // Check if array is sorted
        if(!await isSorted(0, arraySize - 1)) {
            return false;
        }
        if(sorted) {
            break;
        }

        // Shuffle Array
        if(!await shuffleArray(0, arraySize - 1)) {
            return false;
        }
    }
    return true;
}

/**
 * Checks if the array is currently sorted.
 * @param {Number} start The start of the section to check.
 * @param {*} end The end of the section to check.
 * @returns true = continue sorting, false = stop sorting
 */
async function isSorted(start, end) {
    // Reset Sorted, smallest, largest
    sorted = true;
    if(start <= 0 || arraySize <= start) {
        start = 0;
    }
    if(end <= 0 || arraySize <= end) {
        end = arraySize - 1;
    }
    
    // Loop through array
    for(let i = start + 1; i <= end; i++) {
        // Start Step
        if(!await startStep(i, i)) {
            return false;
        }

        if(isGreater(i - 1, i)){
            clearCursor(i);
            sorted = false;
            return true;
        }

        // End Step
        clearCursor(i);
    }

    return true;
}