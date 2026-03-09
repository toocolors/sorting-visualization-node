// Functions
function enableGeneration() {
    // Enable generateEnabled
    document.getElementById("generateEnabled").classList.remove("hide");

    // Disable generateDisabled
    document.getElementById("generateDisabled").classList.add("hide");
}

function enableSort() {
    // Enable sortEnabled
    document.getElementById("sortEnabled").classList.remove("hide");

    // Disable sortDisabled
    document.getElementById("sortDisabled").classList.add("hide");
}

function disableGeneration() {
    // Disable generateEnabled
    document.getElementById("generateEnabled").classList.add("hide");

    // Enable generateDisabled
    document.getElementById("generateDisabled").classList.remove("hide");
}

function disableSort() {
    // Disable sortEnabled
    document.getElementById("sortEnabled").classList.add("hide");

    // Enable sortDisabled
    document.getElementById("sortDisabled").classList.remove("hide");
}