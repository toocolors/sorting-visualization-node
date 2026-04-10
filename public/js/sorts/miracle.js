// ************************************************************************************************
// Script variables
// ************************************************************************************************
export const sortList = [ // 0 = id, 1 = name, 2 = main function
    ["miracle", "Miracle Sort", miracleSort]
];

// ************************************************************************************************
// Sort Functions
// ************************************************************************************************

/**
 * Sorts the array using Bogo Sort.
 */
async function miracleSort() {
    do {
        // Reset Sorted
        sorted = true;

        // Check if array is sorted
        if(!await isSorted(0, array.length - 1)) {
            return false;
        }

        // Pause if not sorted and playing (not stepping)
        if(!sorted && sortstate == 2) {
            await allowUpdate(0);
        }

    } while(!sorted);
}