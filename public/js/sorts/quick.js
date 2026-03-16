// ************************************************************************************************
// Script variables
// ************************************************************************************************
export const sortList = [ // 0 = id, 1 = name, 2 = main function
    ["quick", "Quick Sort", () => quickSort(0, arraySize - 1)]
];

// ************************************************************************************************
// Sorting Functions
// ************************************************************************************************
async function quickSort(start, end) {
    // Return if array is empty or one element
    if (end - start <= 0) {
        return true;
    }

    // Get Pivot
    const pivotLocation = "left";
    switch (pivotLocation) {
        case "right":
            swap(start, end - 1);
            break;
        case "middle":
            swap(start, end / 2);
            break;
        case "left":
        default:
            break;
    }
    const pivot = start;

    // Initialize i and j
    let i = start;
    let j = end;

    // Set Cursors
    setCursor(pivot);
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
    clearClass('cursor');

    // Call Recursive Functions
    if (!await quickSort(start, j - 1)) {
        return false;
    }
    if (!await quickSort(j + 1, end)) {
        return false;
    }

    return true;
}