import render from 'ejs';
import express from 'express';
import { access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Setup file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup app
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

// Setup Routes
// Root
app.get('/', (req, res) => {
    res.render('about'); 
}); // Root

// Algorithm
app.get('/algorithm', async (req, res) => {
    // Get algorithm name
    let algorithmHeading;
    let algorithmName;
    try {
        algorithmHeading = req.query.id;
        algorithmName = algorithmHeading.toLowerCase();
    } catch {
        // Redirect to About
        res.redirect('/'); 
    }
    const accessResults = await accessScript(algorithmName);

    // Attempt to render page
    if(accessResults) {
        res.render("sort", {
            algorithmName,
            algorithmHeading,
        });
    } else {
        res.redirect('/');
    }
})

// API
app.get("/get/algorithm", async (req, res) => {
    // Get algorithm name
    let algoName;
    try {
        algoName = req.query.id.toLowerCase();
    } catch {
        // Send error
        res.status(404).json({ error: "Error getting algorithm file" });
    }

    // Attempt to access script
    const accessResults = await accessScript(algoName);

    // Attempt to send file
    if(accessResults != false) {
        res.sendFile(accessResults[1]);
    } else {
        // Send error
        res.status(404).json({ error: "Algorithm file not found" });
    }
});

app.get("/get/info", async (req, res) => {
    // Get algorithm name
    let id;
    try {
        id = req.query.id.toLowerCase();
    } catch {
        res.status(404).json({error: "Error processing algorithm name"});
    }

    // Attempt to send file
    try {
        res.render(`partials/info/${id}Info`, {}, (err, html) => {
            if(err) {
                return res.status(404).json({ error: "Could not get info file" });
            }
            res.send(html);
        });
    } catch {
        // Send error
        res.status(404).json({ error: "Could not get info file" });
    }
});

// Functions
/**
 * Attempts to access the passed in file.
 * @param {String} fileName The name of the file to access.
 * @returns [name, filePath] if file was accesses, false if file is inaccessible or does not exist.
 */
async function accessScript(name) {
    // Attempt to access file
    let filePath = path.join(__dirname, "public/js/sorts", `${name}.js`);
    try {
        await access(filePath);
        return [name, filePath];
    } catch {
        try {
            // Attempt to remove 'async' and send file
            // Remove 'async'
            name = name.substring("async".length);
            // Reset path
            filePath = path.join(__dirname, "public/js/sorts", `${name}.js`);
            // Access file
            await access(filePath);
            return [name, filePath];
        } catch {
            // File was not found
            return false;
        }
    }
}

// Listen on port 3000
app.listen(3000, () => {
    console.log('server started');
});