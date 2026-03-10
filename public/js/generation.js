// Set Event Listeners
document.getElementById("generateEnabled").addEventListener("click", generateArray);

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
    // Disable Controls
    disableGeneration();
    disableSort();
    
    // Get array size
    arraySize = Number(document.getElementById("arraySize").value);
    
    // Clear Current array
    array = new Array(arraySize);

    // Clear arrayDiv
    document.getElementById("arrayDiv").innerHTML = "";

    // Get array type
    let arrayType = document.getElementById('arrayType').value;

    // Generate array
    switch (arrayType) {
        case "ascending":
            await generateAscending();
            break;
        case "alternating":
            await generateAlternating();
            break;
        case "bell-curve":
            await generateBellCurve();
            break;
        case "descending":
            await generateDescending();
            break;
        case "pyramid":
            await generatePyramid();
            break;
        case "random-duplicates":
            await generateRandomDuplicates();
            break;
        case "random-no-duplicates":
        default:
            await generateRandomNoDuplicates();
            break;
    }

    // Enable Controls
    enableGeneration();
    enableSort();
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
 * Generates an array that alternates between high and low values.
 */
async function generateAlternating() {
    console.log("Generating Alternating Array");

    // Get element box width
    let width = Math.max(1, arrayDiv.clientWidth / arraySize);

    let low = 1;
    let high = arraySize;
    for(let i = 0; i < arraySize; i++) {
        // Update Page
        await allowUpdate();

        // Get num and update high/low
        let num;
        if(i % 2 == 1) {
            num = low;
            low++;
        } else {
            num = high;
            high--;
        }

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
 * Generates an array in the shape of a bell-curve.
 */
async function generateBellCurve() {
    // Get element box width
    let width = Math.max(1, arrayDiv.clientWidth / arraySize);

    let center = arraySize / 2;
    let spread = arraySize / 6; // controls curve width

    let num = 1;
    for(let i = 0; i < arraySize; i++) {
        // Update Page
        await allowUpdate();

        // Gaussian curve formula
        let x = i - center;
        let num = Math.exp(-(x * x) / (2 * spread * spread));

        // scale value
        num *= arraySize;
        num = Math.max(1, Math.floor(num));

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
 * Generates an array with the shape of a pyramid.
 */
async function generatePyramid() {
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
        if(i < arraySize / 2) {
            num += 2;
        } else {
            num -= 2;
        }
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
    console.log("Generating Random (No Duplicates Allowed) Array");

    // Get element box width
    let width = Math.max(1, arrayDiv.clientWidth / arraySize);

    // Create and fill temp array
    let tempArray = new Array(arraySize);
    for(let i = 0; i < tempArray.length; i++) {
        tempArray[i] = i + 1;
    }

    for(let i = 0; i < arraySize; i++) {
        // Update Page
        await allowUpdate();

        // Get and splice random number from tempArray
        let index = Math.floor(Math.random() * tempArray.length)
        let num = tempArray[index];
        tempArray.splice(index, 1);

        // Update array element
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