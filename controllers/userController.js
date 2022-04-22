const User = require('../models/User');
const { use } = require('../router');

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
        req.session.save(() => res.redirect('/'));
    }).catch(function(error) {
        // flash pkg is going to add a flash object onto the request object
        // the first argument is the name of the collection/array of messages
        // that we want to display and the second argument is the actual message
        // that we want to add to the collection

        // this line of code is going to modify the session data and that's
        // going to require a trip to the database, which can take some time,
        // we want to be sure to not perform the redirect until that database
        // has actually completed. So, we'll manually save our session data
        // and provided a callback function, which is called once the it actually
        // updates the session data in the database
        req.flash('errors', error);
        req.session.save(function() {
            res.redirect('/');
        });
    });
};

exports.logout = function(req, res) {
    req.session.destroy(() => res.redirect('/'));
};

exports.register = (req, res) => {
    var user = new User(req.body);
    user.register().then(() => {
        req.session.user = { username: user.user_data.username };
        req.session.save(function() {
            res.redirect('/');
        });
    }).catch((reg_errors) => {
        reg_errors.forEach(function(error) {
            req.flash('reg_errors', error);
        });
        req.session.save(function() {
            res.redirect('/');
        });
    });
};

exports.home = (req, res) => {
    // if the current visitor has session data associated with it
    // then the visitor should not go to the signup page
    if (req.session.user) {
        // console.log(req.session.user);
        res.render("home-dashboard", { username: req.session.user.username });
    } else {
        // so, as we want to show the error message to the user only once, when
        // the user typed the wrong username or password, therefore, we'll delete
        // that flash message from the session data... and all this is done automatically
        // by the flash package... so as soon we access it, it'll also going to delete it
        // from the session
        res.render('home-guest', { errors: req.flash('errors'), reg_errors: req.flash('reg_errors') });

    }
};