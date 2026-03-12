// ************************************************************************************************
// Script variables
// ************************************************************************************************
let largest = 0;
let smallest = 0;
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
    // Outer Loop
    for(let i = 0, j = arraySize - 1; i < j; i++, j--) {
        // Initialize Smallest and Largest
        smallest = i;
        largest = i;

        // Inner Loop - Get Largest and Smallest Element
        for(let k = i; k <= j; k++) {
            // Check sortstate
            if(!await checkSortstate()) {
                return;
            }

            await selectionStep(k, true);
        }

        // Check sortstate
            if(!await checkSortstate()) {
                return;
        }

        // Swap Smallest and Largest
        swap(i, smallest);
        if(largest == i) {
            largest = smallest;
        } 
        swap(j, largest);
        

        // Update Page
        await allowUpdate();
    }
}

/**
 * Sorts the array using Selection Sort.
 */
async function selectionSort() {
    // Outer Loop
    for(let i = 0; i < arraySize; i++) {
        // Initialize Smallest
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
async function selectionStep(index, getLargest = false) {
    // Update Page, Play Sound
    clearClass("cursor");
    setCursor(index);
    await allowUpdate();
    playAudio(array[index]);
    
    // Update largest and smallest
    if(getLargest && isGreater(index, largest)) {
        largest = index;
    } else if(isGreater(smallest, index)) {
        smallest = index;
    }
}