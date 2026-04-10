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

}