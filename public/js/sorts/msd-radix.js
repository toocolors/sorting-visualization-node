// ************************************************************************************************
// Script variables
// ************************************************************************************************
let digits; // Number of digits in the largest number
export const sortList = [ // 0 = id, 1 = name, 2 = main function
    ["msd", "MSD Radix Sort", beginSort],
    ["in-place-msd", "In-Place MSD Radix Sort", beginSort]
];

// ************************************************************************************************
// Main Sort Functions
// ************************************************************************************************

/**
 * Gets sort options and begins sort.
 */
async function beginSort() {
    // Get sort options
    const options = getSortOptions();

    // Get write type
    writeType = options[1];

    // Get number of digits
    digits = getLargest().value.toString().length;

    // Begin sort
    
}