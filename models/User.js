const User = function(user_data) {
    this.user_data = user_data;
    this.errors = [];
}

User.prototype.validate = function() {
    if (this.user_data.username == "") this.errors.push("You must provide a username.");
    if (this.user_data.email == "") this.errors.push("You must provide a valid email address.");
    if (this.user_data.password == "") this.errors.push("You must provide a password.");
}

User.prototype.register = function() {
    this.validate();
}

module.exports = User;