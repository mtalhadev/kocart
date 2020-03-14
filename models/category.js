var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorySchema = new Schema({
    category : String
});

var category = mongoose.model('categories', categorySchema);

module.exports = category;