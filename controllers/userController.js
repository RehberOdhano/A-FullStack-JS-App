const User = require('../models/User');

exports.login = function(req, res) {
    var user = new User(req.body);
    user.login(function(status) {
        res.send(status);
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