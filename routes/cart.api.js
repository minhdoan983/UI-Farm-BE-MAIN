const express = require("express");
const router = express.Router();
const validators = require("../middlewares/validators");
const cartController = require('../controllers/cart.controller')
const { body, param } = require("express-validator");
const { loginRequired } = require("../middlewares/authentication");

router.post(
    "/",
    loginRequired,
    cartController.createCart
);
router.put(
    "/",
    // loginRequired,
    cartController.addItemToCart
);
router.patch('/updateQuantity', cartController.updateCartQuantity);

router.patch('/remove', cartController.removeItemFromCart);

router.get(
    "/",
    loginRequired,
    cartController.getCart
);

module.exports = router;