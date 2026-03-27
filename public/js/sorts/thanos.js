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
await function beginSort() {
    // Get Deletion Type
    try {
        deletion = document.getElementById('thanosOptions').value;
    } catch {
        deletion = 'remove';
    }

    // Begin Thanos Sort
}