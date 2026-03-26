// ************************************************************************************************
// Script variables
// ************************************************************************************************
let largest;
let smallest;
let sorted;
export const sortList = [ // 0 = id, 1 = name, 2 = main function
    ["bogo", "Bogo Sort", async () => {type = "bogo"; await bogoSort();}],
    ["less", "Less Bogo Sort", async () => {type = "less"; await bogoSort();}],
    ["cocktail", "Cocktail Bogo Sort", async () => {type = "cocktail"; await bogoSort();}]
];
let type;

// ************************************************************************************************
// Sort Functions
// ************************************************************************************************

/**
 * Sorts the array using Bogo Sort.
 */
async function bogoSort() {
    // Initialize variables
    let start = 0;
    let end = arraySize - 1; // including
    smallest = start;
    largest = end;

    // Loop through array
    sorted = false;
    while(!sorted) {
        // Check if array is sorted
        if(!await isSorted(start, end)) {
            return false;
        }
        if(sorted) {
            break;
        }

        // Check Smallest and Largest
        switch(type) {
            case 'cocktail':
                if(isEqualOrGreater(end, largest)) {
                    end--;
                }
            case 'less':
                if(isEqualOrGreater(smallest, start)) {
                    start++;
                }
                break;
            case 'bogo':
            default:
                break;
        }

        // Shuffle Array
        if(!await shuffleArray(start, end)) {
            return false;
        }
    }
}

/**
 * Checks if the array is currently sorted.
 * Returns early if type is 'bogo'.
 * Gets smallest if type is 'less' or 'cocktail'.
 * Gets largest if type is 'cocktail'.
 * @param {Number} start The start of the section to check.
 * @param {*} end The end of the section to check.
 * @returns true = continue sorting, false = stop sorting
 */
async function isSorted(start, end) {
    // Reset Sorted
    sorted = true;
    
    // Loop through array
    for(let i = start + 1; i <= end; i++) {
        // Start Step
        if(!await startStep(i, i)) {
            return false;
        }

        // Check sorted, smallest, largest
        switch(type) {
            case 'cocktail':
                if(isGreater(i, largest)) {
                    largest = i;
                }
            case 'less':
                if(isGreater(smallest, i)) {
                    smallest = i;
                }
                if(isGreater(i - 1, i)) {
                    sorted = false;
                }
                break;
            case 'bogo':
            default:
                if(isGreater(i - 1, i)){
                    clearCursor(i);
                    sorted = false;
                    return true;
                }
        }

        // End Step
        clearCursor(i);
    }

    return true;
}