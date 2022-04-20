const User = require('../models/User');

exports.login = function(req, res) {
    var user = new User(req.body);
    // if, callback function is used
    // user.login(function(status) {
    //     res.send(status);
    // });

    // if promise is used
    // this will return a promise
    // if the promise is successfull then it'll execute the "then() block"
    // other "catch() block"
    user.login().then(function(result) {
        // session allows us to have some sort of persistent data from one request
        // to another, meaning our server is going to rememeber the session data
        // we can use that from any of our routes
        // this session data is going to be stored in the memory, which will be
        // deleted/washed out whenever the server restarts... therefore, storing
        // session data in memory isn't a good idea... to overcome this, we'll store
        // the session data into the database
        req.session.user = { username: user.user_data.username }
        res.send(result);
    }).catch(function(error) {
        res.send(error);
    });
};

exports.logout = function() {

};

exports.register = (req, res) => {
    var user = new User(req.body);
    user.register();
    if (user.errors.length) res.send(user.errors);
    else res.render("home-dashboard");
};

exports.home = (req, res) => {
    // if the current visitor has session data associated with it
    // then the visitor should not go to the signup page
    if (req.session.user) {
        // console.log(req.session.user);
        res.render("home-dashboard", { username: req.session.user.username });
    } else {
        res.render('home-guest');
    }
};