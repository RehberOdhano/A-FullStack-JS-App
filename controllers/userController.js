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
    else res.send("Successfully registered!");
};

exports.home = (req, res) => {
    res.render('home-guest');
};