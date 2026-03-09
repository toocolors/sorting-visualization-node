// Global Variables
let arraySize = 500;
let array = [];
const arrayDiv = document.getElementById("arrayDiv");

// Set Event Listeners
document.getElementById("generateButton").addEventListener("click", generateArray);

// Functions
// helper function to use a setTimeout as a promise.
function allowUpdate() {
    return new Promise((f) => {
        setTimeout(f, 0);
    });
}

/**
 * Clears current array and arrayDiv, then generates array
 *  and fills arrayDiv based on selected array type.
 */
async function generateArray() {
    // Clear Current array
    resetArray();

    // Clear arrayDiv
    document.getElementById("arrayDiv").innerHTML = "";

    // Get array type
    let arrayType = document.getElementById('arrayType').value;

    // Generate array
    switch (arrayType) {
        case "ascending":
            await generateAscending();
            break;
        case "descending":
            await generateDescending();
            break;
        case "random-duplicates":
            await generateRandomDuplicates();
            break;
        case "random-no-duplicates":
        default:
            await generateRandomNoDuplicates();
            break;
    }
}

/**
 * Generates an ascending array.
 */
async function generateAscending() {
    console.log("Generating Ascending Array");

    // Get element box width
    let width = Math.max(1, arrayDiv.clientWidth / arraySize);

    let num = 1;
    for(let i = 0; i < arraySize; i++) {
        // Update Page
        await allowUpdate();

        // Update array element at i
        array[i] = num;

        // Get element box height
        let height = Math.max(1, arrayDiv.clientHeight / (arraySize / num));

        // Add box on webpage
        arrayDiv.innerHTML += `<div
        id='element${i}'
        class='element' 
        style='height: ${height}px; width: ${width}px;'
        >
        </div>`;


        // Increment num
        num++;
    }
}

/**
 * Generates a descending array.
 */
async function generateDescending() {
    console.log("Generating Descending Array");

    // Get element box width
    let width = Math.max(1, arrayDiv.clientWidth / arraySize);

    let num = arraySize;
    for(let i = 0; i < arraySize; i++) {
        // Update Page
        await allowUpdate();

        // Update array element at i
        array[i] = num;

        // Get element box height
        let height = Math.max(1, arrayDiv.clientHeight / (arraySize / num));

        // Add box on webpage
        arrayDiv.innerHTML += `<div
        id='element${i}'
        class='element' 
        style='height: ${height}px; width: ${width}px;'
        >
        </div>`;


        // Decrement num
        num--;
    }
}

/**
 * Generates an array with random values (number at each index generated randomly).
 * Duplicates are allowed.
 */
async function generateRandomDuplicates() {
    console.log("Generating Random (Duplicates Allowed) Array");

    // Get element box width
    let width = Math.max(1, arrayDiv.clientWidth / arraySize);

    for(let i = 0; i < arraySize; i++) {
        // Update Page
        await allowUpdate();

        // Get random number
        let num = Math.floor(Math.random() * arraySize) + 1;

        // Update array element at i
        array[i] = num;

        // Get element box height
        let height = Math.max(1, arrayDiv.clientHeight / (arraySize / num));

        // Add box on webpage
        arrayDiv.innerHTML += `<div
        id='element${i}'
        class='element' 
        style='height: ${height}px; width: ${width}px;'
        >
        </div>`;
    }

}

/**
 * Generates an array with random values (placing each number at a random index).
 * Duplicates are not allowed.
 */
async function generateRandomNoDuplicates() {
    console.log("Generating Random (Duplicates Allowed) Array");

    // Get element box width
    let width = Math.max(1, arrayDiv.clientWidth / arraySize);

    // Fill arrayDiv with boxes
    for(let i = 0; i < arraySize; i++) {
        // Add box on webpage
        arrayDiv.innerHTML += `<div
        id='element${i}'
        class='element' 
        style='height: 0px; width: ${width}px;'
        >
        </div>`;
    }

    let num = 1;
    for(let i = 0; i < arraySize; i++) {
        // Update Page
        await allowUpdate();

        // Get random index
        let index = Math.floor(Math.random() * arraySize);

        // Update array element at i (using linear probing)
        while(array[index] != 0) {
            if(index >= arraySize) {
                index = 0;
            } else {
                index++;
            }
        }
        array[index] = num;

        // Get element box height
        let height = Math.max(1, arrayDiv.clientHeight / (arraySize / num));

        // Update box at index
        document.getElementById(`element${index}`).style.height = `${height}px`;

        // Increment Num
        num++;
    }
}

/**
 * Fills array with zeroes.
 */
function resetArray() {
    // Create new empty array
    array = new Array(arraySize);

    // Fill array with 0
    for(let i = 0; i < arraySize; i++) {
        array[i] = 0;
    }
}