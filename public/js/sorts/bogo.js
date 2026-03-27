// ************************************************************************************************
// Script variables
// ************************************************************************************************
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