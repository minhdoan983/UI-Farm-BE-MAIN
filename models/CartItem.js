const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CartItemSchema = Schema(
    {
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item"
        },
        quantity: {
            type: Number
        },
        price: {
            type: Number
        },
        materialSelect: {
            type:String
        },
        colorSelect:{
            type:String
        }
    },
    {
        timestamps: true
    }
)

CartItemSchema.methods.toJSON = function () {
    const obj = this._doc;
    return obj;
};



const CartItem = mongoose.model("CartItem", CartItemSchema);
module.exports = CartItem;

