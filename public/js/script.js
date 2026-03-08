// Global Variables
let arraySize = 10;
let array = [];

// Set Event Listeners
document.getElementById("generateButton").addEventListener("click", generateArray);

// Functions
/**
 * Clears current array and arrayDiv, then generates array
 *  and fills arrayDiv based on selected array type.
 */
function generateArray() {
    // Clear Current array
    array = [];

    // Clear arrayDiv
    document.getElementById("arrayDiv").innerHTML = "";

    // Get array type
    let arrayType = document.getElementById('arrayType').value;

    // Generate array
    switch (arrayType) {
        case "ascending":
            generateAscending();
            break;
        case "descending":
            generateDescending();
            break;
        case "random":
        default:
            generateRandom();
            break;
    }
}

/**
 * Generates an ascending array.
 */
function generateAscending() {
    console.log("Generating Ascending Array");

    // Get arrayDiv
    let arrayDiv = document.getElementById("arrayDiv");

    // Get element box width
    let width = Math.max(1, arrayDiv.clientWidth / arraySize);

    let num = 1;
    for(let i = 0; i < arraySize; i++) {
        // Update array element at i
        array[i] = num;

        // Get element box height
        let height = Math.max(1, arrayDiv.clientHeight / (arraySize / (i + 1)));

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
function generateDescending() {

}

/**
 * Generates an array with random values.
 */
function generateRandom() {

}