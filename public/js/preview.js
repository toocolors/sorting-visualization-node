//************************************************************************************************
// Global variables
// ************************************************************************************************
let algorithm;
let currentAlgoId;
let played = [];
const previewArraySize = 100;
const unplayable = ["Bogo"];
let playlist = [];


//************************************************************************************************
// Event Listeners
// ************************************************************************************************
document.getElementById("play").addEventListener("click", (event) => {
    // Update sortstate
    sortstate = 2;

    // Show/Hide buttons
    event.target.classList.add('hide');
    document.getElementById("pause").classList.remove('hide');
});

document.getElementById("pause").addEventListener("click", (event) => {
    // Update sortstate
    sortstate = 0;

    // Show/Hide buttons
    event.target.classList.add('hide');
    document.getElementById("play").classList.remove('hide');
});

document.getElementById("skip").addEventListener("click", () => {
    // Update sortstate
    sortstate = -1;
});

document.getElementById("unmute").addEventListener("click", (event) => {
    // resume audio
    audio.resume();

    // Disable unmute, enable mute
    event.target.classList.add("hide");
    document.getElementById("mute").classList.remove("hide");
});

document.getElementById("mute").addEventListener("click", (event) => {
    // mute audio
    audio.suspend();

    // Disable unmute, enable mute
    event.target.classList.add("hide");
    document.getElementById("unmute").classList.remove("hide");
});

// ************************************************************************************************
// Call Functions
// ************************************************************************************************
runPreview();

// ************************************************************************************************
// Functions
// ************************************************************************************************

async function runPreview() {
    // Fill playlist
    setupPlaylist();

    // Get initial Algorithm
    await updateAlgorithm();

    // Wait for user to press play
    sortstate = 0;
    await checkSortstate();

    while (true) {
        // Generate Array if needed
        if (!generated || hasDeletion || array.length < previewArraySize) {
            array = new Array(previewArraySize);
            arraySize = previewArraySize;
            maxHeight = array.length;
            arrayDiv.innerHTML = "";
            await generateAscending();
            generated = true;
            hasDeletion = false;
        }

        // Shuffle Array
        await shuffleArray(0, array.length);

        // Play Algorithm
        sorting = true;
        if (sortstate == -1) {
            sortstate = 2;
        }
        await algorithm.sortList[0][2]();

        // Cleanup after running algorithm
        clearClass("cursor");
        if (sortstate != -1); {
            await allowUpdate(0);
        }
        sorting = false;

        // Get new Algorithm
        await updateAlgorithm();
    }
}

/**
 * Selects a random algorithm from the list of sidebar links.
 * @returns The id of the selected algorithm.
 */
function selectAlgorithm() {
    // Check if playlist is empty
    if(playlist.length == 0) {
        // Swap playlist and played
        playlist = played;
        played = new Array();
    }

    // Get random algorithm id and remove it from playlist
    // Check index (excluding current algorithm id)
    let index;
    do {
        index = Math.floor(Math.random() * playlist.length);
    } while(playlist[index] === currentAlgoId);
    // Splice id from playlist
    const id = playlist.splice(index, 1);

    // Add algorithm id to played
    played.push(id);

    // Return link
    return id;
}

/**
 * Fills playlist with algorithm ids that are not in unplayable.
 */
function setupPlaylist() {
    // Get algoLinks
    const links = document.getElementsByClassName("algoLink");
    for(let i = 0; i < links.length; i++) {
        if(!unplayable.includes(links[i].id)) {
            playlist.push(links[i].id);
        }
    }
}

/**
 * Gets a new algorithm and updates heading.
 */
async function updateAlgorithm() {
    // Select random algorithm
    currentAlgoId = selectAlgorithm();

    // Get alrgoithm script
    algorithm = await import(`/get/algorithm?id=${currentAlgoId}`);

    // Update Preview Heading Link
    updatePreviewHeading();
}

/**
 * Updates the text and href of previewLink.
 */
function updatePreviewHeading() {
    // Get link
    const link = document.getElementById("previewLink");

    // Update href
    link.href = `/algorithm?id=${currentAlgoId}`;

    // Update text
    if (currentAlgoId.includes("Async")) {
        link.textContent = currentAlgoId.substring(0, 5) + '-' + currentAlgoId.substring(5) + " Sort";
        link.classList.add('async');
    } else {
        link.textContent = currentAlgoId + " Sort";
        link.classList.remove('async');
    }
}