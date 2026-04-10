// ************************************************************************************************
// Script variables
// ************************************************************************************************
export const sortList = [ // 0 = id, 1 = name, 2 = main function
    ["uplifting", "Uplifting Sort", upliftingSort]
];

// ************************************************************************************************
// Sort Functions
// ************************************************************************************************

/**
 * Sorts the array using Uplifting Sort,
 *  by setting elements equal to the last element if they are smaller.
 */
async function upliftingSort() {
    // Loop through the array
    for(let i = 1; i < array.length; i++) {
        // Start step
        if(!await startStep(i)) {
            return false;
        }

        // Overwrite current element if it is smaller than last
        if(isLess(i, i - 1)) {
            // Update hasDeletion
            hasDeletion = true;

            // Update element
            set(i, get(i - 1));

            // Start step
            if(!await startStep(i)) {
                return false;
            }
        }

        // End Step
        clearCursor(i);
    }
}