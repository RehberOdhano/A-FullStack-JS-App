const express = require('express');
const app = express();

// now express knows where to find the our html templates
app.set('views', 'views');
// telling express to use ejs as a view-engine
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home-guest');
});


app.listen(3000, () => {
    console.log("Server is started...");
});