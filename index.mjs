import render from 'ejs';
import express from 'express';

// Setup app
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

// Setup Routes
// Root
app.get('/', (req, res) => {
    res.redirect('/algorithm/?id=bubble'); 
}); // Root

// Algorithm
app.get('/algorithm', (req, res) => {
    // Get algorithm name
    const algorithmName = req.query.id;

    // Render Page
    res.render("sort", {
        algorithmName
    });
})

// Listen on port 3000
app.listen(3000, () => {
    console.log('server started');
});