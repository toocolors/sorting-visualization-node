// ************************************************************************************************
// Script variables
// ************************************************************************************************
let digits; // Number of digits in the largest number
export const sortList = [ // 0 = id, 1 = name, 2 = main function
    ["lsd-radix", "LSD Radix Sort", beginSort]
];
export const optionsList = new Object();
let writeType; // Type of write to use (buckets or counting)

// Options
optionsList["default"] = `
Type: 
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
    await lsdRadix();
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

async function getBuckets(exp) {
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

async function getCount(exp) {
    // Create count array
    const count = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    // Loop through array and count occurrences of each digit
    for(let i = 0; i < array.length; i++) {
        // Start step
        if(!await startStep(i)) {
            return false;
        }

        // Increment count of digit
        count[Math.floor((get(i) / exp) % 10)]++;

        // End step
        clearCursor(i);
    }

    // Update count array to contain position of each digit in output array
    for(let i = 1; i < count.length; i++) {
        count[i] += count[i - 1];
    }

    // Return count array
    return count;
}

async function radixStep(exp) {
    switch(writeType) {
        case "counting":
            // Get count array
            const count = await getCount(exp);
            // Check if count is false (if the sort was stopped)
            if(count === false) {
                return false;
            }
            // Write to array using count array
            if(!await setCount(count, exp)) {
                return false;
            }
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

async function setBuckets(buckets) {
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

async function setCount(count, exp) {
    // Duplicate array
    const temp = array.slice();

    // Write to array using count array
    for(let i = array.length - 1; i >= 0; i--) {
        // Get digit
        const digit = Math.floor((temp[i] / exp) % 10);

        // Set element at count[digit] - 1 to temp value
        set(count[digit] - 1, temp[i]);

        // Start and end step
        if(!await startStep(count[digit] - 1)) {
            return false;
        }
        clearCursor(count[digit] - 1);

        // Decrement count of digit
        count[digit]--;
    }

    return true;
}