// ************************************************************************************************
// Script variables
// ************************************************************************************************
export let insertionType;
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
                if(!await binaryInsert(i, start)) {
                    return false;
                }
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
 * Inserts the element at index using binary insertion.
 * @param {Number} index The index of the element to insert.
 * @param {Number} start The start of the array portion that is being sorted.
 * @returns 
 */
async function binaryInsert(index, start) {
    // Check if element is already in place
    if (isEqualOrGreater(index, index - 1)) {
        return true;
    }
    
    // Get position to insert element at
    let position = await binarySearch(index, start);
    
    // Return early if stoping sort
    if (position === false) {
        return false;
    }

    // Insert element at position
    let value = get(index);
    for(let i = index; i > position; i--) {
        // Start Step
        if(!await startStep(i)) {
            return false;
        }

        // Set element at i to element at i - 1
        set(i, get(i - 1));

        // End Step
        clearCursor(i);
    }
    // Set element at position to value
    set(position, value);

    return true;
}

/**
 * Searches for the position to insert the element at index using binary search.
 * @param {Number} index The index of the element to insert.
 * @param {Number} start The start of the array portion that is being sorted.
 * @returns 
 */
async function binarySearch(index, start) {
    let end = index - 1;
    let position = index;
    // Binary Search
    while (start <= end) {
        // Get Middle
        let mid = Math.floor((start + end) / 2);

        // Begin Step
        if(!await startStep(mid)) {
            return false;
        }

        // Check which half position is in
        if(isEqual(index, mid)) {
            position = mid;
            clearCursor(mid);
            break;
        } else if(isGreater(index, mid)) {
            start = mid + 1;
        } else {
            end = mid - 1;
            position = mid;
        }

        // End Step
        clearCursor(mid);
    }

    // Return position to insert at
    return position;
}

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
