var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var questionSchema = new Schema({
    text:String,
    date_time:String
});

var Question = mongoose.model('Question', questionSchema);

module.exports = Question;