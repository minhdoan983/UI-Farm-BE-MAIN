const mongoose = require('mongoose')
const Schema = mongoose.Schema

const materialSchema = Schema(
    {
        name: { type: String, require: true },
        listItem: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item"
        }]
    },
    {
        timestamps: true
    }
)

materialSchema.methods.toJSON = function () {
    const obj = this._doc;
    return obj;
};



const Material = mongoose.model("Material", materialSchema);
module.exports = Material;

