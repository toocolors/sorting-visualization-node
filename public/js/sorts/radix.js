// ************************************************************************************************
// Script variables
// ************************************************************************************************
let digits; // Number of digits in the largest number
export const sortList = [ // 0 = id, 1 = name, 2 = main function
    ["lsd", "LSD Radix Sort", beginSort], 
    ["msd", "MSD Radix Sort", beginSort],
    ["inplace", "In-Place Radix Sort", beginSort]
];
export const optionsList = new Object();
let writeType; // Type of write to use (buckets or counting)

// Options
optionsList["default"] = `
Write Type: 
<select id='radixOptions'>
    <option value='buckets'>Buckets</option>
    <option value='counting'>Counting</option>
</select>
`;

// ************************************************************************************************
// Main Sort Functions
// ************************************************************************************************

/**
 * Gets sort options and begins sort.
 */
async function beginSort() {
    // Get sort options
    const options = getSortOptions();

    // Get write type
    writeType = options[1];

    // Get number of digits
    digits = getLargest().value.toString().length;

    // Begin sort
    switch(options[0]) {
        case "inplace":
            break;
        case "msd":
            break;
        case "lsd":
        default:
            await lsdRadix();
            break;
    }
}

/**
 * Sorts the array using LSD Radix Sort.
 */
async function lsdRadix() {
    // Repeat radixStep for each digit
    for(let i = 0; i < digits; i++) {
        if(!await radixStep(Math.pow(10, i))) {
            return false;
        }
    }

    return true;
}

// ************************************************************************************************
// Secondary Sort Functions
// ************************************************************************************************

export async function getBuckets(exp) {
    // Create buckets
    const buckets = [
        [], [], [], [], [], [], [], [], [], []
    ];

    // Loop through array and add to buckets
    for(let i = 0; i < array.length; i++) {
        // Start step
        if(!await startStep(i)) {
            return false;
        }

        // Add element i to bucket
        buckets[Math.floor((get(i) / exp) % 10)].push(get(i));

        // End step
        clearCursor(i);
    }

    // Return buckets
    return buckets;
}

async function radixStep(exp) {
    switch(writeType) {
        case "counting":
            break;
        case "buckets":
        default:
            // Get buckets
            const buckets = await getBuckets(exp);
            // Check if buckets is false (if the sort was stopped)
            if(buckets === false) {
                return false;
            }
            // Write to array using buckets
            if(!await setBuckets(buckets)) {
                return false;
            }
            break;
    }

    return true;
}

export async function setBuckets(buckets) {
    // Write buckets to array
    let index = 0;
    for(let i = 0; i < buckets.length; i++) {
        for(let j = 0; j < buckets[i].length; j++) {
            // Set element at index to bucket value
            set(index, buckets[i][j]);
            
            // Start and end step
            if(!await startStep(index)) {
                return false;
            }
            clearCursor(index);

            // Increment index
            index++;
        }
    }

    return true;
}