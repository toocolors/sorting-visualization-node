// ************************************************************************************************
// Script variables
// ************************************************************************************************
let sorted;
export const sortList = [ // 0 = id, 1 = name, 2 = main function
    ["bubble", "Bubble Sort", bubbleSort], 
    ["cocktail", "Cocktail Sort", cocktailSort]
];

// ************************************************************************************************
// Sort Functions
// ************************************************************************************************
/**
 * Sorts array using bubble sort.
 */
export async function bubbleSort() {
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
 * Sorts the array using Cocktail Shaker Sort
 */
export async function cocktailSort() {
    console.log("Starting Cocktail Shaker Sort");

    sorted = false;
    for(let i = 0; !sorted && i < arraySize; i++) {
        // Reset sorted
        sorted = true;

        // Loop through array forwards
        for(let j = i; j < arraySize - i; j++) {
            // Check sortstate
            if(!await checkSortstate()) {
                return;
            }

            await bubbleStep(j);
        }

        // Check if array is sorted after forward loop
        if(sorted) {
            break;
        }

        // Loop through array backwards
        for(let j = arraySize - i - 1; j > i; j--) {
            // Check sortstate
            if(!await checkSortstate()) {
                return;
            }

            await cocktailStep(j);
        }
    }

    console.log("Finished Cocktail Shaker Sort");
}

// ************************************************************************************************
// Step Functions
// ************************************************************************************************
/**
 * Checks if index - 1 is greater than index.
 *  If so, swaps them and updated sorted.
 * @param {Number} index An array index.
 */
async function bubbleStep(index, offset = 1) {
    // Update page
    await allowUpdate();
    playAudio(array[index]);

    // Update cursor boxes
    clearClass("cursor");
    setCursor(index);

    // Check if elements j and j - 1 are sorted
    if(isGreater(index - 1, index)) {
        // Update Sorted
        sorted = false;
        
        // Swap elements
        swap(index, index - 1);
    }
}

async function cocktailStep(index) {
    // Update page
    await allowUpdate();
    playAudio(array[index]);

    // Update cursor boxes
    clearClass("cursor");
    setCursor(index);

    // Check if elements j and j - 1 are sorted
    if(isGreater(index, index + 1)) {
        // Update Sorted
        sorted = false;
        
        // Swap elements
        swap(index, index + 1);
    }
}