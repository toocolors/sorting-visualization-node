// ************************************************************************************************
// Script variables
// ************************************************************************************************
export const sortList = [ // 0 = id, 1 = name, 2 = main function
    ["odd-even", "Odd-Even Sort", oddEvenSort]
];

// ************************************************************************************************
// Sort Functions
// ************************************************************************************************

/**
 * Sorts the array using Odd-Even Sort.
 * @returns True to continue sorting, False to stop sorting
 */
async function oddEvenSort() {
    // Reset sorted
    sorted = false;

    while(!sorted) {
        // Reset sorted
        sorted = true;

        // Run synchronously
        if (!await loop(0) || !await loop(1)) {
            return false;
        }
    }

    return true;
}

/**
 * Performs one pass on the array starting from start.
 * @param {Number} start The starting index.
 * @returns True to continue sorting, False to stop sorting
 */
async function loop(start) {
    // Loop through array
    for(let i = start; i < array.length - 1; i += 2) {
        // Update page
        if (!await startStep(i)) {
            return false;
        }

        // Swap elements if they are out of order
        if (isGreater(i, i + 1)) {
            // Swap element
            swap(i, i + 1);
            sorted = false;

            // Update page
            if(!await startStep(i)) {
                return false;
            }
        }

        // Clear cursor
        clearCursor(i);
    }    

    return true;
}