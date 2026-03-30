document.getElementById("play").addEventListener("click", async () => {
    // Update sortstate
    sortstate = 2;
    if (!sorting) {
        if (!generated) {
            await generateArray();
        }
        beginSort();
    } else {
        disableButton("step");
        enableButton("pause");
    }
});