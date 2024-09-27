const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ColorSchema = Schema(
    {
        name: { type: String, require: true },
        listItem: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item'
        }]
    },
    {
        timestamps: true
    }
)

ColorSchema.methods.toJSON = function () {
    const obj = this._doc;
    return obj;
};



const Color = mongoose.model("Color", ColorSchema);
module.exports = Color;

