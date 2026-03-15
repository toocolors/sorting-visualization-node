// ************************************************************************************************
// Script variables
// ************************************************************************************************
export const sortList = [ // 0 = id, 1 = name, 2 = main function
    ["quick", "Bubble Sort", () => quickSort(0, arraySize)]
];

// ************************************************************************************************
// Beginning Functions
// ************************************************************************************************
async function quickSort(start, end) {
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

    // i loop
    let i = start + 1;
    let j = end - 1;
    while (i < j && i < end) {
        // Check sortstate
        if (!checkSortstate()) {
            return false;
        }

        // Clear Old Cursor
        document.getElementById(`element${i - 1}`).classList.remove('cursor');

        // Set Cursor
        document.getElementById(`element${i}`).classList.add('cursor');

        // Update Page
        await allowUpdate();

        // j loop

        // Increment i
        i++;
    }

    // Swap pivot

    // Call Recursive Functions
    if (!quickSort(0, pivot)) {
        return false;
    }
    if (!quickSort(pivot, arraySize)) {
        return false;
    }
}