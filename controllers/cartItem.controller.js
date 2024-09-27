const { AppError, catchAsync, sendResponse } = require("../helpers/utils");
const CartItem = require("../models/CartItem");
const cartItemController = {};

cartItemController.createCartItem = catchAsync(async (req, res, next) => {
    let { itemId, quantity, price } = req.body;

    let item = await CartItem.findOne({ itemId });

    if (item) {
        item.quantity += quantity;
        await item.save(); 
    } else {
        item = await CartItem.create({
            itemId,
            quantity,
            price
        });
    }

    item = await CartItem.findOne({ itemId }).populate('itemId');

    return sendResponse(
        res,
        200,
        true,
        item,
        null,
        "Create Cart Item successful"
    );
});


cartItemController.getCartItem = catchAsync(async (req, res, next) => {
    const item = await CartItem.find().populate('itemId')

    return sendResponse(
        res,
        200,
        true,
        item,
        null,
        "Get Cart Item successful "
    );
});

module.exports = cartItemController