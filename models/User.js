const mongoose = require('mongoose')
const Schema = mongoose.Schema
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const userSchema = Schema(
    {
        name: { type: String, require: true },
        email: { type: String, require: true, unique: true },
        phone: { type: String, require: true },
        password: { type: String, require: true, select: false },
        role: {
            type: String,
            required: false,
            enum: ["admin", "customer"],
            default :"customer"
        },
    },
    {
        timestamps: true
    }
)

userSchema.methods.toJSON = function () {
    const obj = this._doc;
    delete obj.password;
    return obj;
};

userSchema.methods.generateToken = async function () {
    const accessToken = await jwt.sign({ _id: this._id }, JWT_SECRET_KEY, {
        expiresIn: "1d",
    });
    return accessToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;

