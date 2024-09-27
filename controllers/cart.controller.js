const { AppError, catchAsync, sendResponse } = require("../helpers/utils");
const Cart = require("../models/Cart");
const cartController = {};
const mongoose = require('mongoose');
const CartItem = require("../models/CartItem");

cartController.createCart = catchAsync(async (req, res, next) => {
    let { user } = req.body;

    let cart = await Cart.findOne({ user });
    if (cart) throw new AppError(409, "Cart already exists", "create Error");

    cart = await Cart.create({
        user
    });

    return sendResponse(
        res,
        200,
        true,
        cart,
        null,
        "Create cart successful"
    );
});

cartController.addItemToCart = catchAsync(async (req, res, next) => {
    let userId = req.query.id
    console.log(req.body)
    let itemId = req.body.itemId;
    let quantity = req.body.quantity
    let price = req.body.price
    let material = req.body.material
    let color = req.body.color
    const cart = await Cart.findOne({ user: userId, isActive: true }).populate('cartItems')
    if (cart.cartItems == null) {
        cart.cartItems = []
    }
    let found = cart.cartItems.find((cartItem) => {
        return cartItem.itemId.toString() == itemId
    })
    console.log(found)
    if (!found) {
        let cartItem = await CartItem.create({
            itemId: itemId,
            quantity: quantity,
            price: price,
            materialSelect: material,
            colorSelect: color
        })
        cart.cartItems.push(cartItem)
        await cart.save()

    } else {
        cart.cartItems.map(async (cartItem) => {
            if (cartItem.itemId.toString() == itemId) {
                cartItem.quantity += quantity
                cartItem.markModified('quantity')
                await cartItem.save()
            }
            return cartItem._id
        })
    }
    return sendResponse(
        res,
        200,
        true,
        cart,
        null,
        "Add Item to cart successful"
    );

});

cartController.removeItemFromCart = catchAsync(async (req, res, next) => {
    let userId = req.query.id
    let cartItems = req.body.cartItems;


    const cart = await Cart.findOneAndUpdate(
        { user: userId },
        { $pull: { cartItems } },
        { new: true, upsert: true }
    );
    return sendResponse(
        res,
        200,
        true,
        cart,
        null,
        "Remove Item from cart successful"
    );
});


cartController.getCart = catchAsync(async (req, res, next) => {
    let userId = req.query.id;

    let cart = await Cart.findOne({ user: userId, isActive: true })
        .populate({
            path: 'cartItems',
        });

    if (!cart) {
        cart = await Cart.create({
            user: userId,
            isActive: true
        });

        return sendResponse(
            res,
            200,
            true,
            cart,
            null,
            "New cart created successfully"
        );
    }

    return sendResponse(
        res,
        200,
        true,
        cart,
        null,
        "Get cart successful"
    );
});



module.exports = cartController;