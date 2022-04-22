const validator = require('validator');
const bcrypt = require('bcryptjs');
// because I changed the module.exports in the db.js file this doesn't work now
// const usersCollection = require('../db').collection('users');
const db = require('../db').db();

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
    return new Promise(async(resolve, reject) => {
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

        // only if the username is valid, then check whether it's unique or already taken
        if (this.user_data.username.length > 2 && this.user_data.username.length < 11 && validator.isAlphanumeric(this.user_data.username)) {
            var usernameExits = await db.collection('users').findOne({ username: this.user_data.username });
            if (usernameExits) this.errors.push("That username is already taken!");
        }

        // only if the email is valid, then check whether it's unique or already taken
        if (validator.isEmail(this.user_data.email)) {
            var emailExits = await db.collection('users').findOne({ email: this.user_data.email });
            if (emailExits) this.errors.push("That email is already taken!");
        }

        resolve()

    });
}

// User.prototype.login = function(callback) {
//     this.cleanUp();
//     usersCollection.findOne({ username: this.user_data.username }, (err, user) => {
//         if (user && user.password == this.user_data.password) callback("Congratulations!");
//         else callback("Invalid username or password!");
//     });
// }

User.prototype.login = function() {
    // we pass an arrow function as a parameter to the promise, instead of anonymous
    // function because, anonymous function will change the "this" keyword within it 
    return new Promise((resolve, reject) => {
        // here we can perform asynchronous operations - operations
        // that are going to take some time to complete, and whenever
        // those operations are complete, we just call resolve or reject
        this.cleanUp();
        // usersCollection.findOne({ username: this.user_data.username }, (err, user) => {
        //     if (user && user.password == this.user_data.password) resolve("Congratulations!");
        //     else reject("Invalid username or password!");
        // });
        db.collection('users').findOne({ username: this.user_data.username }).then((user) => {
            if (user && bcrypt.compareSync(this.user_data.password, user.password)) resolve("Congratulations!");
            else reject("Invalid username or password!");
        }).catch(() => {
            reject("ERROR...");
        });
    });
}

User.prototype.register = function() {
    return new Promise(async(resolve, reject) => {
        // validating and sanitizing/cleaning the user entered data
        this.cleanUp();
        await this.validate();

        // if there are no validation errors only then
        // save user data to the database
        if (!this.errors.length) {
            // hash user password
            var salt = bcrypt.genSaltSync(10);
            this.user_data.password = bcrypt.hashSync(this.user_data.password, salt);
            // usersCollection.insertOne(this.user_data);
            await db.collection('users').insertOne(this.user_data);
            resolve();
        } else reject(this.errors);
    });
}

module.exports = User;