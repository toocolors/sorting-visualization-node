// ************************************************************************************************
// Script variables
// ************************************************************************************************
let deletion;
export const sortList = [ // 0 = id, 1 = name, 2 = main function
    ["purge", "Purge Sort", beginSort]
];
export const optionsList = new Object();

// Options
// all
optionsList["default"] = `
Deletion Type:
<select id='purgeOptions'>
    <option value='shifting'>Shifting</option>
    <option value='instant'>Shifting (Instant)</option>
    <option value='swapping'>Swapping</option>
    <option value='gaps'>Gaps</option>
</select>
`;


// ************************************************************************************************
// Sort Functions
// ************************************************************************************************

/**
 * Gets sort options and starts Thanos Sort.
 */
async function beginSort() {
    // Get Deletion Type
    deletion = getSortOptions()[1];

    // Begin Thanos Sort
    await purgeSort();
}

/**
 * Sorts the array using Purge Sort,
 *  by deleting each elements if they are smaller than the last.
 */
async function purgeSort() {
    // Loop through array
    let i = 1;
    let largest = 0;
    while(i < array.length) {
        // Start Step
        if(!await startStep(i)) {
            return false;
        }
        clearCursor(i);

        // Check if element is out of place
        if(isLess(i, largest)) {
            // Delete element
            switch(deletion) {
                case "instant":
                    remove(i);
                    continue;
                case "swapping":
                    if(!await removeSwap(i)) {
                        return false;
                    }
                    continue;
                case "gaps":
                    setZero(i);
                    break;
                case "shifting":
                default:
                    if(!await removeSlowly(i)) {
                        return false;
                    }
                    continue;
            }
        }

        // Current element is either largest or equal to largest
        else {
            // Update largest
            largest = i;
        }

        // Increment index
        i++;
    }
}