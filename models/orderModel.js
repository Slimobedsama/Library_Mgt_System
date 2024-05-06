const mongoose = require('mongoose');
const Schema = new mongoose.Schema;

const orderSchema = new Schema({
    book: { 
        type: Schema.Types.ObjectId, ref: 'Book', required: true 
    },
    user: { 
        type: Schema.Types.ObjectId, ref: 'User', required: true 
    }
}, { timestamps: true, versionKey: false });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;