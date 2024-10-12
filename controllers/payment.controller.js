const express = require("express");
require("dotenv/config");
const { AppError, catchAsync, sendResponse } = require("../helpers/utils");
const Payment = require("../models/Payment");
const Cart = require("../models/Cart");
const paymentController = {};

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;
const base = "https://api-m.sandbox.paypal.com";

async function generateAccessToken() {
    const BASE64_ENCODED_CLIENT_ID_AND_SECRET = Buffer.from(
        `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
    ).toString("base64");

    const request = await fetch(
        "https://api-m.sandbox.paypal.com/v1/oauth2/token",
        {
            method: "POST",
            headers: {
                Authorization: `Basic ${BASE64_ENCODED_CLIENT_ID_AND_SECRET}`,
            },
            body: new URLSearchParams({
                grant_type: "client_credentials",
                response_type: "id_token",
                intent: "sdk_init",
            }),
        }
    );
    const json = await request.json();
    return json.access_token;
}

paymentController.createOrder = catchAsync(async (req, res, next) => {
    const { total, cartId, shippingAddress } = req.body;
    console.log({shippingAddress})
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders`;
    const payload = {
        intent: "CAPTURE",
        purchase_units: [
            {
                amount: {
                    currency_code: "USD",
                    value: total,
                },
            },
        ],
    };

    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        method: "POST",
        body: JSON.stringify(payload),
    });


    const jsonResponse = await response.json();
    let payment = await Payment.findOne({ cartId })
    if (!payment) {
        payment = await Payment.create({
            cartId,
            status: "Pending",
            paypalOrderID: jsonResponse.id,
            shippingAddress: shippingAddress
        })
        console.log(jsonResponse.id)

    }
    return sendResponse(
        res,
        200,
        true,
        { jsonResponse, payment },
        null,
        "Create order successful"
    );
});


paymentController.captureOrder = catchAsync(async (req, res, next) => {
    const { orderID, cartId } = req.params;
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders/${orderID}/capture`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });
    console.log(response)


    const jsonResponse = await response.json();
    await Payment.findOneAndUpdate(
        { paypalOrderID: orderID },
        { $set: { status: "Approved" } }
    )
    await Cart.findOneAndUpdate(
        { cartId },
        { $set: { isActive: false } }
    )

    return sendResponse(
        res,
        200,
        true,
        jsonResponse,
        null,
        "Capture order successful"
    );
});
paymentController.getPayment = catchAsync(async (req, res, next) => {
    const payment = await Payment.find()
        .populate({
            path: 'cartId',
            populate: {
                path: 'cartItems',
                populate: {
                    path: 'itemId'
                }
            }
        });

    return sendResponse(
        res,
        200,
        true,
        payment,
        null,
        "Get Payment successful"
    );
});

paymentController.getPaymentByUser = catchAsync(async (req, res, next) => {
    const { userId } = req.params;

    const payments = await Payment.find()
        .populate({
            path: 'cartId',
            populate: {
                path: 'cartItems',
                populate: {
                    path: 'itemId'
                }
            }
        });

    const filteredPayments = payments.filter(payment => payment.cartId && payment.cartId.user.toString() === userId);

    if (!filteredPayments.length) {
        return sendResponse(res, 200, true, null, "No payments found for this user");
    }

    return sendResponse(
        res,
        200,
        true,
        filteredPayments,
        null,
        "Get Payment by User successful"
    );
});


module.exports = paymentController