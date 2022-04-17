const express = require('express');
// require executes the provided file/pkg name and that's going to happen
// immediately and returns the export of that file/pkg, which will be saved
// in the variable router in this case
const router = require('./router');
// require('dotenv').config();
const app = express();

// it just tells the express to add the user's submitted data 
// onto our request object, so that we can easily access that data
// from req.body
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));
// now express knows where to find the our html templates
app.set('views', 'views');
// telling express to use ejs as a view-engine
app.set('view engine', 'ejs');


app.use('/', router);

// if (process.env.PORT == null || process.env.PORT == "") { process.env.PORT = 3000; }
// app.listen(process.env.PORT, () => {
//     console.log("SERVER IS STARTED...");
// });

module.exports = app;