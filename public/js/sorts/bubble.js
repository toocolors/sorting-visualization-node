// Set Event Listeners
document.getElementById("sortButton").addEventListener("click", bubbleSort);

// Functions
/**
 * Sorts array using bubble sort.
 */
async function bubbleSort() {
    console.log("Starting Bubble Sort");

    let sorted = false;
    for(let i = 0; !sorted && i < arraySize; i++) {
        // Reset sorted
        sorted = true;

        // Loop through array
        for(let j = 1; j < arraySize - i; j++) {
            // Update page
            await allowUpdate();

            // Check if elements j and j - 1 are sorted
            if(isGreater(j - 1, j)) {
                // Update sorted
                sorted = false;

                // Update cursor boxes
                clearCursors();
                setCursor(j);

                // Swap elements
                swap(j, j - 1);
            }
        }
    }

    console.log("Finished Bubble Sort");
}