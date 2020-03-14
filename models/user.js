var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    fname:String,
    lname:String,
    email:String,
    password:String,
    country:String,
    wallet:Number,
});

userSchema.index({email:1});

var User = mongoose.model('User', userSchema);

module.exports = User;