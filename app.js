require("dotenv").config()
const cors = require("cors")
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose')
const indexRouter = require('./routes/index');
const { sendResponse } = require("./helpers/utils.js")
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

app.use('/ui-farm', indexRouter);
const mongoURI = process.env.MONGOURI
mongoose
    .connect(mongoURI)
    .then(() => console.log("Connected to Database"))
    .catch((e) => console.log(e))

app.use((req, res, next) => {
    const err = new Error("Not Found")
    err.statusCode = 404
    next(err)
})
app.use((err, req, res, next) => {
    console.log('Error', err)
    if (err.isOperational) {
        return sendResponse(
            res,
            err.statusCode ? err.statusCode : 500,
            false,
            null,
            { message: err.message },
            err.errorType
        )
    } else {
        return sendResponse(
            res,
            err.statusCode ? err.statusCode : 500,
            false,
            null,
            { message: err.message },
            "Internal Server Error"
        )
    }
})

// const Item = require('./models/Item');

// async function checkColor() {
//   // Find the material and populate the 'listItem' field with full Item documents
//   const color = await Item.findOne({ _id: '66dde52e1746c3db269629f1' }).populate('material').populate('color').populate('gallery');

//   console.log(color.material._id);
// }

// checkColor();
module.exports = app;

