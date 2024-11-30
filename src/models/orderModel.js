import mongoose from 'mongoose';
const Schema =  mongoose.Schema;

const orderSchema = new Schema({
    book: { 
        type: Schema.Types.ObjectId, ref: 'Book', required: true 
    },
    user: { 
        type: Schema.Types.ObjectId, ref: 'User', required: true 
    }
}, { timestamps: true, versionKey: false });

const Order = mongoose.model('Order', orderSchema);
export default Order;