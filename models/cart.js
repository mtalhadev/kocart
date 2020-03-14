var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cartSchema = new Schema({
    products:[{
        _id: String,
        title:String,
        quantity:Number,
        sale_price: Number,
        image : String,
    }],
    user_id:String
});

var Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;