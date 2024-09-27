const mongoose = require('mongoose')
const Schema = mongoose.Schema

const GallerySchema = Schema(
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

GallerySchema.methods.toJSON = function () {
    const obj = this._doc;
    return obj;
};



const Gallery = mongoose.model("Gallery", GallerySchema);
module.exports = Gallery;

