const mongoose = require('mongoose');
const schema = mongoose.Schema;

const productSchema = new schema({
    name:{
        type:String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    }
})


const Product = mongoose.model('product', productSchema, 'products');
module.exports = Product;