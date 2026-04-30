// ************************************************************************************************
// Script variables
// ************************************************************************************************
let gapType;
const sorts = await import("/get/algorithm?id=OffsetSorts");
export const sortList = [ // 0 = id, 1 = name, 2 = main function
    ["shell", "Shell Sort", beginSort]
];
export const optionsList = new Object();

// Options
// Default
optionsList["default"] = `
Gap Sequence:
<select id='gapSelect>
    <option value=''></option>
    <option value='/2'>n/2</option>
    <option value='/3'>n/3</option>
    <option value='/4'>n/4</option>
    <option value='/8'>n/8</option>
    <option value='/10'>n/10</option>
    <option value='-1'>n-1</option>
</select>
`;

// ************************************************************************************************
// Sort Functions
// ************************************************************************************************

/**
 * Begins Shell Sort
 */
async function beginSort() {
    // Get options
    const options = getSortOptions();

    // Get gap type
    gapType = options[1];

    // Start shellsort
    await shellSort();
}

/**
 * Sorts the array using Shell Sort.
 * @returns True to continue sorting, false to stop sorting
 */
async function shellSort() {
    // Run gap sequences
    let gap = array.length;
    while(gap > 1) {
        // Decrement gap
        switch(gapType) {
            case "-1":
                gap--;
                break;
            case "/10":
                gap = Math.floor(gap / 10);
                break;
            case "/8":
                gap = Math.floor(gap / 8);
                break;
            case "/4":
                gap = Math.floor(gap / 4);
                break;
            case "/3":
                gap = Math.floor(gap / 3);
                break;
            case "/2":
            default:
                gap = Math.floor(gap / 2);
                break;
        }

        // Break if gap is 1 or below
        if(gap <= 1) {
            break;
        }

        // Run sort with gap
        if(!await sorts.insertionSort(0, array.length - 1, 1, gap)) {
            return false;
        }
    }
    
    // Run final gap sequence
    if(!await sorts.insertionSort(0, array.length - 1, 1, 1)) {
        return false;
    }
}