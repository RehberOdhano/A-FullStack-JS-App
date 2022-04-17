const User = require('../models/User');

exports.login = () => {

};

exports.logout = () => {

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