const express = require('express');
// require executes the provided file/pkg name and that's going to happen
// immediately and returns the export of that file/pkg, which will be saved
// in the variable router in this case
const router = require('./router');
const userController = require('./controllers/userController');
const app = express();

app.use(express.static('public'));
// now express knows where to find the our html templates
app.set('views', 'views');
// telling express to use ejs as a view-engine
app.set('view engine', 'ejs');


app.use('/', userController.home);


app.listen(3000, () => {
    console.log("Server is started...");
});