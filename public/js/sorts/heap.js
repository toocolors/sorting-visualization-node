// ************************************************************************************************
// Script variables
// ************************************************************************************************
let heapifyCursors;
export const sortList = [ // 0 = id, 1 = name, 2 = main function
    ["max", "Max Heap Sort", beginSort],
    ["min", "Min Heap Sort", beginSort]
];
export const optionsList = new Object();

// Options
optionsList["default"] = `
Heapify Colors:
<select id='heapOptions'>
    <option value='no'>Hide</option>
    <option value='yes'>Show</option>
</select>
`;

// ************************************************************************************************
// Main Sort Functions
// ************************************************************************************************

/**
 * Begins Heap Sort
 */
async function beginSort() {
    // Get options
    const options = getSortOptions();

    // Get heapifyCursors
    heapifyCursors = false;
    if(options[1] === 'yes') {
        heapifyCursors = true;
    }

    // Begin Heap Sort
    switch(options[0]) {
        case "min":
            break;
        case "max":
        default:
            await maxHeapSort();
            break;
    }
}

/**
 * Sorts the array using Max Heap Sort.
 */
async function maxHeapSort() {
    // Build heap
    for(let i = Math.floor(array.length / 2) - 1; i >= 0; i--) {
        if(!await maxHeapify(i, array.length)) {
            return false;
        }
    }

    // Extract heap root (largest element) one by one
    for(let i = array.length - 1; i > 0; i--) {
        // Start and end step
        if(!await startStep(0)) {
            return false;
        }
        clearCursor(0);
        
        // Move heap root to end of array (putting it in place)
        swap(0, i);

        // Re-Heapify the heap
        if(!await maxHeapify(0, i)) {
            return false;
        }
    }

    return true;
}


// ************************************************************************************************
// Secondary Sort Functions
// ************************************************************************************************

/**
 * Turns the array into a maximum heap.
 * @param {Number} root The root of the current sub-tree.
 * @param {Number} end The end of the section to heapify (excluding).
 * @returns True to continue sorting, False to stop sorting.
 */
async function maxHeapify(root, end) {
    // Initialize Largest, left and right indices
    let largest = root;
    const left = 2 * root + 1;
    const right = 2 * root + 2;

    // Check if left child is larger than root
    if (left < end) {
        if(heapifyCursors) {
            setCursor(left, "green");
        }
        if(isGreater(left, largest)) { 
            largest = left;
        }
    }

    // Check if right child is larger than root or left child
    if (right < end) {
        if(heapifyCursors) {
            setCursor(right, "blue");
        }

        if(isGreater(right, largest)) { 
            largest = right;
        }
    }

    // Start Step
    if(!await startStep(heapifyCursors ? root : -1)) {
        return false;
    }

    // If root is not largest
    if(root != largest) {
        // Swap root and largest
        swap(largest, root);

        // Show swap and clear cursors
        if(!await startStep(heapifyCursors ? root : -1, root)) {
            return false;
        }
        clearClass("cursor");

        // Recusively heapify the sub-tree at largest
        if(!await maxHeapify(largest, end)) {
            return false;
        }
    }

    // Clear Cursors
    clearClass("cursor");

    return true;
}