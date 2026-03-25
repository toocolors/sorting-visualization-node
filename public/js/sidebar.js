// ************************************************************************************************
// Add Event Listeners
// ************************************************************************************************
document.getElementById("menuToggle").addEventListener("click", () => {
    // Show Sidebar
    document.querySelector("nav").classList.toggle("open");
    document.getElementById("overlay").classList.toggle("show");

    // Update Hamburger Menu Text
    const menuToggle = document.getElementById("menuToggle");
    if(menuToggle.textContent === "X") {
        menuToggle.textContent = "☰";
    } else {
        menuToggle.textContent = "X";
    }
});

document.getElementById("overlay").addEventListener("click", () => {
    // Hide Sidebar
    document.querySelector("nav").classList.remove("open");
    document.getElementById("overlay").classList.remove("show");

    // Update Hamburger Menu Text
    document.getElementById("menuToggle").textContent = "☰"
});