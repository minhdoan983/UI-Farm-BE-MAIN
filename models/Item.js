const mongoose = require('mongoose')
const Schema = mongoose.Schema

const itemSchema = Schema(
    {
        name: { type: String, require: true },
        material: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Material"
        }],
        price: { type: Number, require: true },
        color: {
            type: Array, require: true
        },
        imgUrl: { type: Array, require: true }
    },
    {
        timestamps: true
    }
)

itemSchema.methods.toJSON = function () {
    const obj = this._doc;
    return obj;
};



const Item = mongoose.model("Item", itemSchema);
module.exports = Item;

