// Script variables
let sorted;

// Functions
async function beginSort() {
    await bubbleSort();
}

/**
 * Sorts array using bubble sort.
 */
async function bubbleSort() {
    console.log("Starting Bubble Sort");

    // Disable Controls
    disableGeneration();
    disableSort();

    sorted = false;
    for(let i = 0; !sorted && i < arraySize; i++) {
        // Reset sorted
        sorted = true;

        // Loop through array
        for(let j = 1; j < arraySize - i; j++) {
            // Check sortstate
            if(!await checkSortstate()) {
                return;
            }

            await bubbleStep(j);
        }
    }

    // Clear Cursors
    clearCursors();

    // Enable Controls
    enableGeneration();
    enableSort();

    // Reset sortstate
    sortstate = 0;

    console.log("Finished Bubble Sort");
}

/**
 * Checks if index - 1 is greater than index.
 *  If so, swaps them and updated sorted.
 * @param {Number} index An array index.
 */
async function bubbleStep(index) {
    // Update page
    await allowUpdate();

    // Update cursor boxes
    clearCursors();
    setCursor(index);

    // Check if elements j and j - 1 are sorted
    if(isGreater(index - 1, index)) {
        // Update Sorted
        sorted = false;
        
        // Swap elements
        swap(index, index - 1);
    }
}