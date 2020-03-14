var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var couponSchema = new Schema({
    serial:String,
    title:String,
    stock_price:Number,
    sale_price:Number,
    quantity:Number,
    description:String,
    colors:[String],
    sizes:[String],
    category:String
});

var Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;