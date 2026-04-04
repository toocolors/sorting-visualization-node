// ************************************************************************************************
// Script variables
// ************************************************************************************************
const insertion = await import("/get/algorithm?id=Insertion");
let insertionSize;
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
Insertion Size:
<input type='number' id='dualPivotOptions' value='0' min='0'>
`;
let pivotType;

// ************************************************************************************************
// Sorting Functions
// ************************************************************************************************
async function beginSort() {
    // Get options
    const options = getSortOptions();

    // Get threaded
    if (document?.getElementsByClassName('currentAlgo')[0]?.classList?.contains("async")) {
        threaded = true;
    } else {
        threaded = false;
    }

    // Begin Quick Sort
    switch (options[0]) {
        case "dual-pivot":
            // Get and clamp insertion size
            insertionSize = parseInt(options[1]);
            if (isNaN(insertionSize) || insertionSize < 0) {
                insertionSize = 0;
            } else if (insertionSize > array.length) {
                insertionSize = array.length - 1;
            }
            // Begin sort
            await dualPivot(0, arraySize - 1);
            break;
        case "quick":
        case "median":
        default:
            // Get pivot type and begin sort
            pivotType = options[1];
            await quickSort(0, arraySize - 1);
            break;
    }
}

/**
 * Sorts the array using Dual Pivot Quick Sort
 * @param {Number} start The start of the current section.
 * @param {Number} end The end of the current section (including).
 */
async function dualPivot(start, end) {
    // Return if partition is empty or one element
    if (end - start <= 0) {
        return true;
    }

    // If partition is smaller than insertion size, use insertion sort
    if (end - start <= insertionSize) {
        return await insertion.insertionSort(start, end);
    }

    // Get pivot
    // Sort first/last if needed
    if (isGreater(start, end)) {
        swap(start, end);
    }
    const pivotLeft = start;
    const pivotRight = end;

    // Initialize i, j, and k
    let i = pivotLeft + 1; // Separates the left and middle partitions.
    let j = pivotLeft + 1; // Iterates through the partition.
    let k = pivotRight - 1; // Separates the middle and right partitions.

    // Set initial cursors for pivots and i, and k
    setCursor(pivotLeft);
    setCursor(pivotRight);
    setCursor(i);
    setCursor(k);

    // Partition Array
    while (j <= k) {
        // Start step
        if (!await startStep(j)) {
            return false;
        }

        // Check if element j is less than the left pivot
        if (isLess(j, pivotLeft)) {
            swap(i, j);
            clearCursor(i);
            i++;
            setCursor(i);
        }

        // Check if element j is greater than or equal to the right pivot
        else if (isEqualOrGreater(j, pivotRight)) {
            while (isEqualOrGreater(k, pivotRight) && j < k) {
                // Decrement k and update page
                clearCursor(k);
                k--;
                if (!await startStep(k)) {
                    return false;
                }
            }
            swap(j, k);

            // Decrement k and update page
            clearCursor(k);
            k--;
            if (!await startStep(k)) {
                return false;
            }

            // Check if element j is less than the left pivot after swapping
            if (isLess(j, pivotLeft)) {
                swap(i, j);
                // Increment i and update page
                clearCursor(i);
                i++;
                if (!await startStep(i)) {
                    return false;
                }
            }
        }

        // Clear cursor for j
        clearCursor(j);

        // Increment j
        j++;
    }

    // Move pivots to their final positions
    // Decrement i and update page
    clearCursor(i);
    i--;
    if (!await startStep(i)) {
        return false;
    }
    // Increment k and update page
    clearCursor(k);
    k++;
    if (!await startStep(k)) {
        return false;
    }

    // Swap pivots with i and k and update page
    swap(pivotLeft, i);
    swap(pivotRight, k);
    await allowUpdate();

    // Clear cursors
    clearCursor(pivotLeft);
    clearCursor(pivotRight);
    clearCursor(i);
    clearCursor(j);
    clearCursor(k);

    // Call recursive sorts
    if (threaded) {
        // Sort partitions asynchronously
        // Start Recursive Functions
        let left = dualPivot(start, i - 1);
        let middle = dualPivot(i + 1, k - 1);
        let right = dualPivot(k + 1, end);

        // Wait for recursive functions
        await Promise.all([left, middle, right]);

        // Check sortstate
        if (sortstate == -1) {
            return false;
        }

    } else {
        // Sort partitions synchronously
        if (!await dualPivot(start, i - 1)) {
            return false;
        }
        if (!await dualPivot(i + 1, k - 1)) {
            return false;
        }
        if (!await dualPivot(k + 1, end)) {
            return false;
        }
    }

    return true;
}

/**
 * Sorts the first, middle, and last elements of the current section.
 * @param {Number} start The start of the current section.
 * @param {Number} end The end of the current section (including).
 */
async function sortMedian(start, end) {
    // Get middle index
    const middle = Math.max(start, Math.floor((start + end) / 2));

    // Set cursors
    setCursor(start);
    setCursor(middle);
    setCursor(end);

    // Compare/Swap first and middle
    if (isGreater(start, middle)) {
        swap(start, middle);
    }
    // Start step
    if (!await startStep(-1, start)) {
        return false;
    }

    // Compare/Swap first and last
    if (isGreater(start, end)) {
        swap(start, end);
    }
    // Start step
    if (!await startStep(-1, end)) {
        return false;
    }

    // Compare/Swap middle and last
    if (isGreater(middle, end)) {
        swap(middle, end);
    }
    // Start step
    if (!await startStep(-1, middle)) {
        return false;
    }

    // Clear cursors
    clearCursor(start);
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

    // Set pivot cursor
    setCursor(pivot, "blue");

    // Set Cursors
    setCursor(i, "green");
    setCursor(j, "red");

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
        clearCursor(i - 1, "green");
        setCursor(i, "green");

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
                setCursor(j, "red");

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
        setCursor(j, "red");

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
    clearCursor(pivot);
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