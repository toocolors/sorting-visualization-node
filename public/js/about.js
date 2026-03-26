// ************************************************************************************************
// Event Listeners
// ************************************************************************************************
document.getElementById("Random").addEventListener("click", navigateRandom);
document.getElementById("RandomAbout").addEventListener("click", navigateRandom);

// ************************************************************************************************
// Call Functions
// ************************************************************************************************
setLinks();

// ************************************************************************************************
// Functions
// ************************************************************************************************

/**
 * Updates the href values of the algo links
 */
function setLinks() {
    // Get algoLinks
    let links = document.getElementsByClassName("algoLink");
    for(let i = 0; i < links.length; i++) {
        links[i].href = `/algorithm?id=${links[i].id}`;
    }

    // Get Async Section Links
    links = document.querySelectorAll("#asyncSection a");
    for(let i = 0; i < links.length; i++) {
        links[i].textContent = "Async-" + links[i].textContent;
        links[i].href = 'Async' + links[i].href;
    }
}

/**
 * Navigates to a random algorithm page.
 */
function navigateRandom() {
    // Get random algorithm
    const links = document.getElementsByClassName("algoLink");
    const link = links[Math.floor(Math.random() * links.length)];

    // Navigate to algorithm
    window.location.assign(`/algorithm?id=${link.id}`);
}