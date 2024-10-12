const express = require("express");
const router = express.Router();
const validators = require("../middlewares/validators");
const paymentController = require("../controllers/payment.controller");
const { body, param } = require("express-validator");

router.post(
    "/orders",
    paymentController.createOrder
);

router.post(
    "/orders/:orderID/capture",
    paymentController.captureOrder
);

router.get(
    "/",
    paymentController.getPayment
);
router.get('/user/:userId', paymentController.getPaymentByUser);

module.exports = router;