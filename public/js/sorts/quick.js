// ************************************************************************************************
// Script variables
// ************************************************************************************************
let threaded;
export const sortList = [ // 0 = id, 1 = name, 2 = main function
    ["quick", "Quick Sort", beginSort],
    ["median", "Median of Three", beginSort],
    ["dual-pivot", "Dual Pivot", beginSort]
];
export const optionsList = new Object();

// Options
// quick
optionsList[sortList[0][0]] = `
Pivot: 
<select id='quickOptions'>
    <option value='left'>Left</option>
    <option value='middle'>Middle</option>
    <option value='right'>Right</option>
</select>
`;
// median of three
optionsList[sortList[1][0]] = `
Pivot:
<select id='medianOptions'>
    <option value='median'>Median</option>
    <option value='smallest'>Smallest</option>
    <option value='largest'>Largest</option>
</select>
`;
// Dual Pivot
optionsList[sortList[2][0]] = `
Pivot:
<select id='dualPivotOptions'>
    <option value='first-last'>First/Last</option>
    <option value='small-large'>Smallest/Largest</option>
</select>
`;
let pivotType;

// ************************************************************************************************
// Sorting Functions
// ************************************************************************************************
async function beginSort() {
    // Get options
    const options = getSortOptions();
    pivotType = options[1];

    // Get threaded
    if (document?.getElementsByClassName('currentAlgo')[0]?.classList?.contains("async")) {
        threaded = true;
    } else {
        threaded = false;
    }

    // Begin Quick Sort
    switch (options[0]) {
        case "dual-pivot":
            break;
        case "quick":
        case "median":
        default:
            await quickSort(0, arraySize - 1);
            break;
    }
}

/**
 * Sorts the first, middle, and last elements of the current section.
 * @param {Number} start The start of the current section.
 * @param {Number} end The end of the current section (including).
 */
async function sortMedian(start, end) {
    // Get middle index
    const middle = Math.max(start, Math.floor((start + end) / 2));

    // Compare/Swap first and middle
    if (isGreater(start, middle)) {
        swap(start, middle);
    }
    // Start step
    setCursor(middle);
    if (!await startStep(start)) {
        return false;
    }
    // End step
    clearCursor(start);
    clearCursor(middle);

    // Compare/Swap first and last
    if (isGreater(start, end)) {
        swap(start, end);
    }
    // Start step
    setCursor(start);
    if (!await startStep(end)) {
        return false;
    }
    // End step
    clearCursor(start);
    clearCursor(end);

    // Compare/Swap middle and last
    if (isGreater(middle, end)) {
        swap(middle, end);
    }
    // Start step
    setCursor(end);
    if (!await startStep(middle)) {
        return false;
    }
    // End step
    clearCursor(middle);
    clearCursor(end);

    return true;
}

async function quickSort(start, end) {
    // Return if array is empty or one element
    if (end - start <= 0) {
        return true;
    }

    // Initialize i and j
    let i = start;
    let j = end;

    // Get Pivot
    switch (pivotType) {
        // Median of three
        case "median":
            if (!await sortMedian(start, end)) {
                return false;
            }
            // Swap second element with median
            swap(start + 1, Math.floor((start + end) / 2));
            // Increment i so that it starts at the third element (since the first two are sorted)
            i++;
            // Decrement j so that it starts at the second to last element (since the last is sorted)
            j--;
            break;
        case "smallest":
            if (!await sortMedian(start, end)) {
                return false;
            }
            // Decrement j so that it starts at the second to last element (since the last is sorted)
            j--;
            break;
        case "largest":
            if (!await sortMedian(start, end)) {
                return false;
            }
            // Swap start and end so that the largest element is at the start
            swap(start, end);
            break;
        // Standard quicksort
        case "right":
            swap(start, end);
            break;
        case "middle":
            swap(start, Math.max(start, Math.floor(start + ((end - start) / 2))));
            break;
        case "left":
        default:
            break;
    }
    const pivot = i;

    // Set Cursors
    setCursor(i);
    setCursor(j);

    // Update page
    await allowUpdate();

    // Check Sort State
    if (!await checkSortstate()) {
        return false;
    }

    // i loop
    // Increment i until i reaches the end of partition or until i and j meet
    while (i <= end && i < j) {
        // Increment i
        i++;

        // Update cursor for element i
        clearCursor(i - 1);
        setCursor(i);

        // Update Page
        await allowUpdate();
        playAudio(array[i]);

        // Check Sortstate
        if (!await checkSortstate()) {
            return false;
        }

        // Check if element i is greater than or equal to the pivot
        if (isEqualOrGreater(i, pivot)) {
            // j loop
            while (j >= start && j > i) {
                // Check Sortstate
                if (!await checkSortstate()) {
                    return false;
                }

                // Check if element j is less than or equal to the pivot.
                if (isEqualOrGreater(pivot, j)) {
                    // Swap element i and j
                    swap(i, j);

                    // Update Page
                    await allowUpdate();
                    playAudio(array[j]);

                    // Check Sortstate
                    if (!await checkSortstate()) {
                        return false;
                    }

                    break;
                }

                // Decrement j
                j--;

                // Update cursor for element i
                clearCursor(j + 1);
                setCursor(j);

                // Update Page
                await allowUpdate();
                playAudio(array[j]);
            }
        }
    }

    // Decrement j until it reaches the pivot or an element smaller than the pivot
    while (isEqualOrGreater(j, pivot) && j > pivot) {
        // Decrement j
        j--;

        // Check Sortstate
        if (!await checkSortstate()) {
            return false;
        }

        // Update cursor for element i
        clearCursor(j + 1);
        setCursor(j);

        // Update Page
        await allowUpdate();
        playAudio(array[j]);
    }

    // Check Sortstate
    if (!await checkSortstate()) {
        return false;
    }

    // Swap pivot
    swap(pivot, j);

    // Update Page
    await allowUpdate();

    // Check Sortstate
    if (!await checkSortstate()) {
        return false;
    }

    // Clear Cursors
    clearCursor(i);
    clearCursor(j);

    if (threaded) {
        // Start Recursive Functions
        let left = quickSort(start, j - 1);
        let right = quickSort(j + 1, end);

        // Wait for recursive functions
        await Promise.all([left, right]);

        // Check sortstate
        if (sortstate == -1) {
            return false;
        }
    } else {
        // Call Recursive Functions
        if (!await quickSort(start, j - 1)) {
            return false;
        }
        if (!await quickSort(j + 1, end)) {
            return false;
        }
    }

    return true;
}