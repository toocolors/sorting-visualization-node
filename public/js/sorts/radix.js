// ************************************************************************************************
// Script variables
// ************************************************************************************************
let digits; // Number of digits in the largest number
export const sortList = [ // 0 = id, 1 = name, 2 = main function
    ["lsd-radix", "LSD Radix Sort", beginSort],
    ["msd-radix", "MSD Radix Sort", beginSort]
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
    switch(options[0]) {
        case "msd-radix":
            await msdRadix(0, array.length - 1, digits - 1);
            break;
        case "lsd-radix":
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

/**
 * Sorts the array recusively using MSD Radix Sort.
 * @param {Number} start The start of the section to sort.
 * @param {Number} end The end of the section to sort (including).
 * @param {Number} exp The current exponent/digit to sort.
 * @returns True to continue sorting, False to stop sorting.
 */
async function msdRadix(start, end, exp) {
    // Break Recursion
    if(end <= start || exp < 0) {
        return true;
    }

    // Make pass through array segment
    const arr = await msdRadixStep(start, end, Math.pow(10, exp));

    // Return if sorting is stopping
    if(arr === false) {
        return false;
    }

    // Call Recursive Functions
    let prev = start;
    for(let i = 0; i < arr.length; i++) {
        if(!await msdRadix(prev, arr[i] - 1, exp - 1)) {
            return false;
        }

        // Increment prev
        prev = arr[i];
    }

    return true;
}

// ************************************************************************************************
// Secondary Sort Functions
// ************************************************************************************************

/**
 * Puts each element in the array into buckts for digits 0-9 based on the value of their digit at exp.
 * @param {Number} start The start of the section to build buckets for.
 * @param {Number} end The end of the section to build buckets for (including).
 * @param {Number} exp The place of the current digit.
 * @returns Buckets for digits 0-9.
 */
async function getBuckets(start, end, exp) {
    // Create buckets
    const buckets = [
        [], [], [], [], [], [], [], [], [], []
    ];

    // Loop through array and add to buckets
    for(let i = start; i <= end; i++) {
        // Start step
        if(!await startStep(i)) {
            return false;
        }

        // Add element i to bucket
        buckets[Math.floor((get(i) / exp) % 10)].push(get(i));
        incrementOperation("writes");

        // End step
        clearCursor(i);
    }

    // Return buckets
    return buckets;
}

/**
 * Counts the frequencies of values at the current digit and returns a distributions array.
 * @param {Number} start The start of the section to build counts for.
 * @param {Number} end The end of the section to build counts for (including).
 * @param {Number} exp The place of the current digit.
 * @returns An array containing indices for each value to be used for Counting Sort.
 */
async function getCount(start, end, exp) {
    // Create count array
    const count = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    // Loop through array and count occurrences of each digit
    for(let i = start; i <= end; i++) {
        // Start step
        if(!await startStep(i)) {
            return false;
        }

        // Increment count of digit
        count[Math.floor((get(i) / exp) % 10)]++;
        incrementOperation("writes");

        // End step
        clearCursor(i);
    }

    // Update count array to contain position of each digit in output array
    count[0] += start;
    for(let i = 1; i < count.length; i++) {
        count[i] += count[i - 1];
        incrementOperation("reads");
        incrementOperation("writes");
    }

    // Return count array
    return count;
}

async function msdRadixStep(start, end, exp) {
    switch(writeType) {
        case "counting":
            // Get Counts
            const count = await getCount(start, end, exp);
            // Check if sorting is stopping
            if (count === false) {
                return false;
            }
            const boundaries = count.slice();
            // Write counts
            if(!await setCount(start, end, count, exp)) {
                return false;
            }
            // Return count
            return boundaries;
        case "buckets":
        default:
            // Get buckets
            const buckets = await getBuckets(start, end, exp);
            // Check if sorting is stopping
            if (buckets === false) {
                return false;
            }
            // Write buckets
            if(!await setBuckets(start, buckets)) {
                return false;
            }
            // Get bucket lengths and put them into array
            const arr = new Array(10);
            let sum = start;
            for(let i = 0; i < buckets.length; i++) {
                sum += buckets[i].length;
                arr[i] = sum;
            }
            // Return bucket lengths
            return arr;
    }
}

/**
 * Makes one pass through the array using LSD Radix Sort.
 * @param {Number} exp The digit for the current pass.
 * @returns True to continue sorting, False to stop sorting.
 */
async function radixStep(exp) {
    switch(writeType) {
        case "counting":
            // Get count array
            const count = await getCount(0, array.length - 1, exp);
            // Check if count is false (if the sort was stopped)
            if(count === false) {
                return false;
            }
            // Write to array using count array
            if(!await setCount(0, array.length - 1, count, exp)) {
                return false;
            }
            break;
        case "buckets":
        default:
            // Get buckets
            const buckets = await getBuckets(0, array.length - 1, exp);
            // Check if buckets is false (if the sort was stopped)
            if(buckets === false) {
                return false;
            }
            // Write to array using buckets
            if(!await setBuckets(0, buckets)) {
                return false;
            }
            break;
    }

    return true;
}

/**
 * Writes to the array using the contents of the buckets array.
 * @param {Number} start The start of the section to overwrite using buckets.
 * @param {Array} buckets The array containing buckets for values 0-9.
 * @returns True to continue sorting, False to stop sorting.
 */
async function setBuckets(start, buckets) {
    // Write buckets to array
    let index = start;
    for(let i = 0; i < buckets.length; i++) {
        for(let j = 0; j < buckets[i].length; j++) {
            // Set element at index to bucket value
            set(index, buckets[i][j]);
            incrementOperation("reads");
            
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

/**
 * Creates a copy of the array, loops backwards through it, 
 *  and places each element according to the corresponding value in count array.
 * @param {Number} start The start of the section to overwrite using counts.
 * @param {Number} end The end of the section to overwrite using counts (including).
 * @param {Array} count The array containing indices for each value.
 * @param {Number} exp The place of the current digit.
 * @returns True to continue sorting, False to stop sorting.
 */
async function setCount(start, end, count, exp) {
    // Duplicate array
    const temp = array.slice(start, end + 1);
    incrementOperation("reads", array.length);
    incrementOperation("writes", array.length);

    // Write to array using count array
    for(let i = temp.length - 1; i >= 0; i--) {
        // Get digit
        const digit = Math.floor((temp[i] / exp) % 10);
        incrementOperation("reads");

        // Set element at count[digit] - 1 to temp value
        set(count[digit] - 1, temp[i]);
        incrementOperation("reads");

        // Start and end step
        if(!await startStep(count[digit] - 1)) {
            return false;
        }
        clearCursor(count[digit] - 1);

        // Decrement count of digit
        count[digit]--;
        incrementOperation("writes");
    }

    return true;
}