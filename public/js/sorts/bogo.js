// ************************************************************************************************
// Script variables
// ************************************************************************************************
export const sortList = [ // 0 = id, 1 = name, 2 = main function
    ["bogo", "Bogo Sort", bogoSort],
    ["bozo", "Bozo Sort", bozoSort]
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
    while (!sorted) {
        // Check if array is sorted
        if (!await isSorted(0, arraySize - 1)) {
            return false;
        }
        if (sorted) {
            break;
        }

        // Shuffle Array
        if (!await shuffleArray(0, arraySize - 1)) {
            return false;
        }
    }
    return true;
}

/**
 * Sorts the array using Bozo Sort.
 * @returns True to continue sorting, False to stop sorting
 */
async function bozoSort() {
    // Loop through array
    sorted = false;
    while (!sorted) {
        // Check if array is sorted
        if (!await isSorted(0, array.length - 1)) {
            return false;
        }
        if (sorted) {
            break;
        }

        // Swap two random elements
        // Get indices
        const index1 = Math.floor(Math.random() * array.length);
        let index2 = Math.floor(Math.random() * array.length);
        if (index1 == index2) {
            index2 = (index1 + 1) % array.length;
        }
        // Swap indices
        swap(index1, index2);

        // Update Page
        setCursor(index1);
        if (!await startStep(index2)) {
            return false;
        }
        clearCursor(index1);
        clearCursor(index2);
    }
    return true;
}