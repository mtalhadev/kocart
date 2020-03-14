var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reviewSchema = new Schema({
    fname:String,
    lname:String,
    product_id:String,
    rating:Number
});

var Review = mongoose.model('Review', reviewSchema);

module.exports = Review;