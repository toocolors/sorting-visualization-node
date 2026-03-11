// ************************************************************************************************
// Script variables
// ************************************************************************************************
let sorted;

// ************************************************************************************************
// Functions
// ************************************************************************************************


/**
 * Sorts array using bubble sort.
 */
async function bubbleSort() {
    console.log("Starting Bubble Sort");

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
    playAudio(array[index]);

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