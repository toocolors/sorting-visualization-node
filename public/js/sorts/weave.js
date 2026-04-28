// ************************************************************************************************
// Script variables
// ************************************************************************************************
const sorts = await import("/get/algorithm?id=OffsetSorts");
export const sortList = [ // 0 = id, 1 = name, 2 = main function
    ["insertion", "Weave (Insertion)", beginSort],
    ["bubble", "Weave (Bubble)", beginSort]
];
export const optionsList = new Object();
let threadCount;
let sortType;

// Options
// Default
optionsList["default"] = `
Threads:
<input type='number' value='2' id='threadOption'>
`;

// ************************************************************************************************
// Sort Functions
// ************************************************************************************************

/**
 * Gets sort options and begins sort.
 */
async function beginSort() {
    // Get sort options
    const options = getSortOptions();
    sortType = options[0];
    threadCount = parseInt(options[1]);
    // Clamp threadCount
    if (isNaN(threadCount) || threadCount < 2) {
        threadCount = 2;
    }


    // Begin sorting
    await weaveSort();
}

/**
 * Sorts the array using Weave Sort.
 * @returns True to continue sorting, False to stop sorting
 */
async function weaveSort() {
    // Create threads
    const threads = [];
    for (let i = 0; i < threadCount; i++) {
        switch (sortType) {
            case "bubble":
                threads.push(sorts.bubbleSort(i, array.length - 1, threadCount));
                break;
            case "insertion":
            default:
                threads.push(sorts.insertionSort(i, array.length - 1, threadCount, threadCount));
                break;
        }
    }

    // Await threads
    await Promise.all(threads);

    // Exit if sorting has stopped
    if (!await checkSortstate()) {
        return false;
    }

    // Perform final pass
    switch (sortType) {
        case "bubble":
            if (!await sorts.bubbleSort(0, array.length - 1, 1)) {
                return false;
            }
            break;
        case "insertion":
        default:
            if (!await sorts.insertionSort(0, array.length - 1, 1, 1));
            break;
    }

    return true;
}