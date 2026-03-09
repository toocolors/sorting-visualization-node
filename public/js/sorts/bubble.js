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
            if(array[j - 1] > array[j]) {
                // Update sorted
                sorted = false;

                // Update cursor boxes
                let previous = document.getElementsByClassName("cursor");
                for(let i = 0; i < previous.length; i++) {
                    previous[i].classList.remove("cursor");
                }
                document.getElementById(`element${j}`).classList.add("cursor");

                // Update sorted and swap elements
                let temp = array[j - 1];
                array[j - 1] = array[j];
                array[j] = temp;

                // Update boxes
                document.getElementById(`element${j}`).style.height = `${Math.max(1, arrayDiv.clientHeight / (arraySize / array[j]))}px`;
                document.getElementById(`element${j - 1}`).style.height = `${Math.max(1, arrayDiv.clientHeight / (arraySize / array[j - 1]))}px`;

            }
        }
    }

    console.log("Finished Bubble Sort");
}