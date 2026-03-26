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
    const filePath = path.join(__dirname, "public/js/sorts", `${algorithmName}.js`);

    // Render Page
    try {
        await access(filePath);
        res.render("sort", {
            algorithmName,
            algorithmHeading
        });
    } catch {
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
    const filePath = path.join(__dirname, "public/js/sorts", `${req.query.id}.js`);

    // Attempt to send file
    try {
        await access(filePath);
        res.sendFile(filePath);
    } catch {
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

// Listen on port 3000
app.listen(3000, () => {
    console.log('server started');
});