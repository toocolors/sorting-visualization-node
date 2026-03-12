// ************************************************************************************************
// Script variables
// ************************************************************************************************
let largest = 0;
let smallest = 0;
let getLargest = false;
const sortList = [
    ["selection", selectionSort], 
    ["double-selection", doubleSelectionSort]
];

// ************************************************************************************************
// Sort Functions
// ************************************************************************************************
/**
 * Sorts the array using Double Selection Sort.
 */
async function doubleSelectionSort() {

}

/**
 * Sorts the array using Selection Sort.
 */
async function selectionSort() {
    // Outer Loop
    for(let i = 0; i < arraySize; i++) {
        // Inizialize Smallest
        smallest = i;

        // Inner Loop - Get Smallest Element
        for(let j = i; j < arraySize; j++) {
            // Check sortstate
            if(!await checkSortstate()) {
                return;
            }

            await selectionStep(j);
        }

        // Check sortstate
        if(!await checkSortstate()) {
            return;
        }

        // Swap Smallest
        swap(i, smallest);

        // Update Page
        await allowUpdate();
    }
}

// ************************************************************************************************
// Step Functions
// ************************************************************************************************

/**
 * Compares the current index to largest and smallest and updates them if necessary.
 */
async function selectionStep(index) {
    // Update Page, Play Sound
    clearClass("cursor");
    setCursor(index);
    await allowUpdate();
    playAudio(array[index]);
    
    // Update largest
    if(getLargest && isGreater(index, largest)) {
        largest = index;
    }

    // Update smallest
    if(isGreater(smallest, index)) {
        smallest = index;
    }
}