const mongoose = require('mongoose')
const Schema = mongoose.Schema

const paymentSchema = Schema(
    {
        cartId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cart"
        },
        status: {
            type: String,
        },
        paypalOrderID: {
            type: String,
        }
    },
    {
        timestamps: true
    }
)

paymentSchema.methods.toJSON = function () {
    const obj = this._doc;
    return obj;
};

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;

