// ************************************************************************************************
// Script variables
// ************************************************************************************************
const insertion = await import("/get/algorithm?id=Insertion");
let insertionSize;
export const sortList = [ // 0 = id, 1 = name, 2 = main function
    ["merge", "Merge Sort", beginSort]
];
export const optionsList = new Object();

// Options
// Default
optionsList["default"] = `
Insertion Threshold:
<input type='number' id='dualPivotOptions' value='0' min='0'>
`;
let pivotType;

// ************************************************************************************************
// Sorting Functions
// ************************************************************************************************
async function beginSort() {
    // Get options
    const options = getSortOptions();

    // Get and clamp insertion size
    insertionSize = parseInt(options[1]);
    if (isNaN(insertionSize) || insertionSize < 0) {
        insertionSize = 0;
    } else if (insertionSize > array.length) {
        insertionSize = array.length - 1;
    }

    // Begin Merge Sort
    switch (options[0]) {
        case "merge":
        default:
            break;
    }
}