const validator = require('validator');
const usersCollection = require('../db').collection('users');

const User = function(user_data) {
    this.user_data = user_data;
    this.errors = [];
}


User.prototype.cleanUp = function() {
    if (typeof(this.user_data.username) != "string") this.user_data.username = "";
    if (typeof(this.user_data.email) != "string") this.user_data.email = "";
    if (typeof(this.user_data.password) != "string") this.useruser_data.password = "";

    // get rid of any bogus properties in request object
    this.user_data = {
        username: this.user_data.username.trim().toLowerCase(),
        email: this.user_data.email.trim().toLowerCase(),
        password: this.user_data.password
    };
}

User.prototype.validate = function() {
    if (this.user_data.username == "") this.errors.push("You must provide a username.");
    if (this.user_data.username != "" && !validator.isAlphanumeric(this.user_data.username)) {
        this.errors.push("Username should only contain alphanumeric characters.");
    }
    if (!validator.isEmail(this.user_data.email)) this.errors.push("You must provide a valid email address.");
    if (this.user_data.password == "") this.errors.push("You must provide a password.");
    if (this.user_data.password.length > 0 && this.user_data.password.length < 12) {
        this.errors.push("Password must be at least 12 characters long!");
    }
    if (this.user_data.password.length > 20) {
        this.errors.push("Password can't exceed 20 characters!");
    }
    if (this.user_data.username.length > 0 && this.user_data.password.length < 3) {
        this.errors.push("Username must be at least 3 characters long!");
    }
    if (this.user_data.username.length > 10) {
        this.errors.push("Username can't exceed 10 characters!");
    }
}

User.prototype.login = function(callback) {
    this.cleanUp();
    // console.log(this.user_data);
    usersCollection.findOne({ username: this.user_data.username }, (err, user) => {
        if (user && user.password === this.user_data.password) callback("Congratulations!");
        else callback("Invalid username or password!");
    });
}


User.prototype.register = function() {
    // validating and sanitizing/cleaning the user entered data
    this.cleanUp();
    this.validate();

    // if there are no validation errors only then
    // save user data to the database
    if (!this.errors.length) {
        usersCollection.insertOne(this.user_data);
    }

}

module.exports = User;