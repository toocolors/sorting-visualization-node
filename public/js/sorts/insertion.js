// ************************************************************************************************
// Script variables
// ************************************************************************************************
export let insertionType; // 0 = insertion, 1 = binary insertion
export const sortList = [ // 0 = id, 1 = name, 2 = main function
    ["insertion", "Insertion Sort", beginInsertion],
    ["binary", "Binary Insertion Sort", beginInsertion]
];

// ************************************************************************************************
// Sort Functions
// ************************************************************************************************

async function beginInsertion() {
    // Get inserstion type
    insertionType = getSortOptions()[0];

    // Start Insertion Sort
    await insertionSort(0, arraySize - 1);
}

/**
 * 
 * @param {Number} start The start of the array. 
 * @param {Number} end The end of the array (including).
 */
export async function insertionSort(start, end) {
    // Outer Loop
    for(let i = start + 1; i <= end; i++) {
        // Check sortstate
        if(!await checkSortstate()) {
            return false;
        }

        // Start Step
        if(!await startStep(i)) {
            return false;
        }

        // Try to insert element i
        switch(insertionType) {
            case "binary":
                break;
            case "insertion":
            default:
                if (!await insert(i, start)) {
                    return false;
                }
                break;
        }

        // End Step
        clearCursor(i);
    }

    return true;
}

// ************************************************************************************************
// Insert Functions
// ************************************************************************************************

/**
 * Inserts the element at index into the sorted part of the array.
 * @param {Number} index The index of the current iteration.
 * @param {Number} start The start of the array.
 */
async function insert(index, start) {
    // Loop until element is in place
    while(index >= start && isGreater(index - 1, index)) {
        // Swap Elements
        swap(index - 1, index);

        // Start and end step
        if(!await startStep(index)) {
            return false;
        }
        clearCursor(index);

        // Decrement index
        index--;
    }

    return true;
}
