// ************************************************************************************************
// Script variables
// ************************************************************************************************
let deletion;
export const sortList = [ // 0 = id, 1 = name, 2 = main function
    ["thanos", "Thanos Sort", beginSort]
];
export const optionsList = new Object();

// Options
// all
optionsList["default"] = `
Deletion Type:
<select id='thanosOptions'>
    <option value='remove'>Removal</option>
    <option value='zero'>Zero</option>
</select>
`;


// ************************************************************************************************
// Sort Functions
// ************************************************************************************************

/**
 * Gets sort options and starts Thanos Sort.
 */
async function beginSort() {
    // Get Deletion Type
    try {
        deletion = document.getElementById('thanosOptions').value;
    } catch {
        deletion = 'remove';
    }

    // Begin Thanos Sort
    await thanosSort(0, array.length - 1);
}

/**
 * Deletes half of the array section.
 * @param {Number} start The start of the section to 'snap'. 
 * @param {Number} end The end of the section to 'snap' (including).
 */
async function snap(start, end) {
    // Fill indices array
    const indices = [];
    for(let i = start; i <= end; i++) {
        if(array[i] != 0) {
            indices.push(i);
        }
    }

    // Get snap size
    const snapSize = Math.floor(indices.length / 2);

    for(let i = 0; i < snapSize; i++) {
        // Get random index
        const rand = Math.floor(Math.random() * indices.length);
        const index = indices[rand];
        // Check if index is invalid
        if(index === undefined) {
            break;
        }
        // Remove index
        indices.splice(rand, 1);

        // Start Step
        if(!await startStep()) {
            return false;
        }

        // Delete element at index
        switch(deletion) {
            case "zero":
                setZero(index);
                break;
            case "remove":
            default:
                remove(index);
                // Fix indices after shift
                for (let j = 0; j < indices.length; j++) {
                    if (indices[j] > index) {
                        indices[j]--;
                    }
                }
                end--;
                break;
        }
    }

    return end;
}

/**
 * Sorts the array using Thanos Sort.
 * @param {Number} start The start of the section to sort. 
 * @param {Number} end The end of the section to sort (including).
 */
async function thanosSort(start, end) {
    sorted = false;
    while(!sorted && end - start > 0) {
        // Check if array is sorted
        if(await isSorted(start, end) === false) {
            return false;
        }
        if(sorted) {
            break;
        }

        // Snap
        end = await snap(start, end);
        if(end === false) {
            return false;
        }
    }

    return true;
}