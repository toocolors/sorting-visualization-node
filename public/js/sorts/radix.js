// ************************************************************************************************
// Script variables
// ************************************************************************************************
let digits; // Number of digits in the largest number
export const sortList = [ // 0 = id, 1 = name, 2 = main function
    ["lsd", "LSD Radix Sort", beginSort], 
    ["msd", "MSD Radix Sort", beginSort],
    ["inplace", "In-Place Radix Sort", beginSort]
];
export const optionsList = new Object();
let writeType; // Type of write to use (buckets or counting)

// Options
optionsList["default"] = `
Write Type: 
<select id='radixOptions'>
    <option value='buckets'>Buckets</option>
    <option value='counting'>Counting</option>
</select>
`;

// ************************************************************************************************
// Sort Functions
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
    switch(options[0]) {
        case "inplace":
            break;
        case "msd":
            break;
        case "lsd":
        default:
            break;
    }
}