// ************************************************************************************************
// Script variables
// ************************************************************************************************
export const sortList = [ // 0 = id, 1 = name, 2 = main function
    ["odd-even", "Odd-Even Sort", beginSort],
    ["concurrent-odd-even", "Concurrent Odd-Even", beginSort]
];

// ************************************************************************************************
// Sort Functions
// ************************************************************************************************

/**
 * Gets sorting options and begins Odd-Even Sort.
 */
async function beginSort() {
    // Get sort options
    const options = getSortOptions();

    // Start sorting
    await oddEvenSort(options[0] === "concurrent-odd-even" ? true : false);
}

async function oddEvenSort(concurrent) {
    // Reset sorted
    sorted = false;

    while(!sorted) {
        // Reset sorted
        sorted = true;

        // Run asynchronously

        // Run synchronously
        if (!await loop(0) || !await loop(1)) {
            return false;
        }
    }

    return true;
}

// ************************************************************************************************
// Synchronous Sort Functions
// ************************************************************************************************

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