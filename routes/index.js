var express = require('express');
var router = express.Router();

// authApi
const authApi = require("./auth.api");
router.use("/auth", authApi);

// userApi
const userApi = require("./user.api");
router.use("/users", userApi);

const itemApi = require("./item.api");
router.use("/items", itemApi);

const colorApi = require("./color.api");
router.use("/colors",colorApi)

const materialApi = require("./material.api");
router.use("/materials",materialApi)

const galleryApi = require("./gallery.api");
router.use("/galleries",galleryApi)

const cartItemApi = require("./cartItem.api");
router.use("/cartItem",cartItemApi)

const cartApi = require("./cart.api");
router.use("/cart",cartApi)

const paymentApi = require("./payment.api");
router.use("/payment",paymentApi)

module.exports = router;
