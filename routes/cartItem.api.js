const express = require("express");
const router = express.Router();
const validators = require("../middlewares/validators");
const cartItemController = require('../controllers/cartItem.controller')
const { body, param } = require("express-validator");

router.post(
  "/",
  cartItemController.createCartItem
);

router.get(
    "/",
    cartItemController.getCartItem
  );


module.exports = router;