// ************************************************************************************************
// Script variables
// ************************************************************************************************
let heapifyCursors;
let heapType;
export const sortList = [ // 0 = id, 1 = name, 2 = main function
    ["max", "Max Heap", beginSort],
    ["min", "Min Heap", beginSort],
    ["reverse", "Reverse Min Heap", beginSort]
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

    // Get heapType
    heapType = options[0];

    // Get heapifyCursors
    heapifyCursors = false;
    if (options[1] === 'yes') {
        heapifyCursors = true;
    }

    // Begin Heap Sort
    switch (heapType) {
        case "reverse":
            await reverseMinHeapSort();
            break;
        case "max":
        case "min":
        default:
            await heapSort();
            break;
    }
}

/**
 * Sorts the array using Heap Sort.
 * Does Max Heap Sort if heapType is 'max'.
 * Does Min Heap Sort if heapType is 'min'.
 */
async function heapSort() {
    // Build heap
    for (let i = Math.floor(array.length / 2) - 1; i >= 0; i--) {
        if (!await heapify(i, array.length)) {
            return false;
        }
    }

    // Extract heap root (largest element) one by one
    for (let i = array.length - 1; i > 0; i--) {
        // Start and end step
        if (!await startStep(0)) {
            return false;
        }

        // Move heap root to end of array (putting it in place)
        swap(0, i);

        // Re-Heapify the heap
        if (!await heapify(0, i)) {
            return false;
        }
    }

    // Reverse array if doing Min Heap Sort
    if(heapType === "min" && !await reverse()) {
        return false;
    }

    return true;
}

/**
 * Sorts the array using Reverse Min Heap Sort.
 */
async function reverseMinHeapSort() {
    // Build heap
    for (let i = Math.floor((array.length) / 2); i < array.length; i++) {
        if (!await reverseMinHeapify(i, -1)) {
            return false;
        }
    }

    // Extract heap root (largest element) one by one
    for (let i = 0; i < array.length - 1; i++) {
        // Start and end step
        if (!await startStep(array.length - 1)) {
            return false;
        }

        // Move heap root to end of array (putting it in place)
        swap(array.length - 1, i);

        // Re-Heapify the heap
        if (!await reverseMinHeapify(array.length - 1, i)) {
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
async function heapify(root, end) {
    // Initialize Largest, left and right indices
    let largest = root;
    const left = 2 * root + 1;
    const right = 2 * root + 2;

    // Check if left child is larger than root
    if (left < end) {
        if (heapifyCursors) {
            setCursor(left, "green");
        }
        if (heapType === "max" && isGreater(left, largest)) {
            largest = left;
        } else if(heapType === "min" && isLess(left, largest)) {
            largest = left;
        }
    }

    // Check if right child is larger than root or left child
    if (right < end) {
        if (heapifyCursors) {
            setCursor(right, "blue");
        }

        if (heapType === "max" && isGreater(right, largest)) {
            largest = right;
        } else if(heapType === "min" && isLess(right, largest)) {
            largest = right;
        }
    }

    // Start Step
    if (heapifyCursors && !await startStep(root)) {
        return false;
    }

    // If root is not largest
    if (root != largest) {
        // Swap root and largest
        swap(largest, root);

        // Show swap
        if (!await startStep(heapifyCursors ? root : -1, root)) {
            return false;
        }
    }

    // Clear Cursors
    if (heapifyCursors) {
        clearCursor(left);
        clearCursor(right);
        if (root != 0) {
            clearCursor(root);
        }
    }

    // Recusively heapify the sub-tree at largest
    if (root != largest && !await heapify(largest, end)) {
        return false;
    }

    return true;
}

/**
 * Reverses the array.
 * Called if doing Min Heap Sort.
 * @returns True if continuing sort, False if stopping sort.
 */
async function reverse() {
    for(let i = 0; i < Math.floor(array.length / 2); i++) {
        // Get index of last element
        let index = array.length - 1 - i;

        // Swap first and last elements
        swap(i, index);

        // Start and end step
        setCursor(i)
        if(!await startStep(index)) {
            return false;
        }
        clearCursor(index);
        clearCursor(i);
    }

    return true;
}

/**
 * Turns the array into a minimum heap.
 * @param {Number} root The root of the current sub-tree.
 * @param {Number} start The start of the section to heapify (including).
 * @returns True to continue sorting, False to stop sorting.
 */
async function reverseMinHeapify(root, start) {
    // Initialize Largest, left and right indices
    let smallest = root;
    const left = array.length - ((array.length - root) * 2);
    const right = array.length - ((array.length - root) * 2) - 1;

    // Check if left child is larger than root
    if (left > start) {
        if (heapifyCursors) {
            setCursor(left, "green");
        }
        if (isLess(left, smallest)) {
            smallest = left;
        }
    }

    // Check if right child is larger than root or left child
    if (right > start) {
        if (heapifyCursors) {
            setCursor(right, "blue");
        }

        if (isLess(right, smallest)) {
            smallest = right;
        }
    }

    // Start Step
    if (heapifyCursors && !await startStep(root)) {
        return false;
    }

    // If root is not smallest
    if (root != smallest) {
        // Swap root and smallest
        swap(smallest, root);

        // Show swap
        if (!await startStep(heapifyCursors ? root : -1, root)) {
            return false;
        }
    }

    // Clear Cursors
    if (heapifyCursors) {
        clearCursor(left);
        clearCursor(right);
        if (root != array.length - 1) {
            clearCursor(root);
        }
    }

    // Recusively heapify the sub-tree at smallest
    if (root != smallest && !await reverseMinHeapify(smallest, start)) {
        return false;
    }

    return true;
}