var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
    serial:String,
    title:String,
    stock_price:Number,
    sale_price:Number,
    quantity:Number,
    description:String,
    colors:[String],
    sizes:[String],
    categories:[String],
    image:String,
    vendor: String,
});

var Product = mongoose.model('Product', productSchema);

module.exports = Product;