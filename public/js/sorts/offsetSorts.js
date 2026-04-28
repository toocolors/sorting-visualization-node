// ************************************************************************************************
// Sort Functions
// ************************************************************************************************

/**
 * Sorts a portion of the array using Insertion Sort.
 * @param {Number} start The start of the section to sort.
 * @param {Number} end The end of the section to sort (including).
 * @param {Number} increment The amount to increment by when moving to the next element.
 * @param {Number} insertIncrement The amount to decrement by when inserting the current element.
 * @returns True to continue sorting, False to stop sorting.
 */
export async function insertionSort(start, end, increment, insertDecrement) {
        // Outer Loop
        for(let i = start + increment; i <= end; i += increment) {
            // Start Step
            if(!await startStep(i)) {
                return false;
            }
    
            // Loop until element is in place
            let index = i;
            while(index - insertDecrement >= start && isGreater(index - insertDecrement, index)) {
                // Swap Elements
                swap(index - insertDecrement, index);

                // Update Page
                setCursor(index - insertDecrement);
                if(!await startStep(index)) {
                    return false;
                }
                clearCursor(index);
                clearCursor(index - insertDecrement);

                // Decrement index
                index -= insertDecrement;
            }
    
            // End Step
            clearCursor(i);
        }
    
    return true;
}
