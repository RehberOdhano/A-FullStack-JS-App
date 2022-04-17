exports.login = () => {

};

exports.logout = () => {

};

exports.register = (req, res) => {
    console.log(req.body.username, req.body.password, req.body.email);
    res.send("Successfully submitted!");
};

exports.home = (req, res) => {
    res.render('home-guest');
};