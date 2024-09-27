const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CartSchema = Schema(
    {
        cartItems: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "CartItem"
        }
        ],
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        isActive:{
            type: Boolean,
            default:true
        }
    },
    {
        timestamps: true
    }
)

CartSchema.methods.toJSON = function () {
    const obj = this._doc;
    return obj;
};



const Cart = mongoose.model("Cart", CartSchema);
module.exports = Cart;

