const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    products:[{
        _id: String,
        title:String,
        quantity:Number,
        sale_price:Number,
    }],
    status:String,
    total_price:Number,
    name: String,
    address1:String,
    address2:String,
    country:String,
    postal_code:String,
    city:String,
    email: String,
    contact: String,
    user_id:String,
    card_number: String,
    card_name: String,
    card_exp_date: String,
    card_VCC: String,
});


module.exports = mongoose.model('Order', orderSchema);