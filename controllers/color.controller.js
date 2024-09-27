const { AppError, catchAsync, sendResponse } = require("../helpers/utils");
const Color = require("../models/Color");
const colorController = {};

colorController.registerColor = catchAsync(async (req, res, next) => {
  let { name } = req.body;

  let colorName = await Color.findOne({ name });
  if (colorName) throw new AppError(409, "Color already exists", "Register Error");

  colorName = await Color.create({
    name,
  });

  return sendResponse(
    res,
    200,
    true,
    colorName,
    null,
    "Create Color successful"
  );
});
colorController.registerItems = catchAsync(async (req, res, next) => {
    let { listItem } = req.body;
    console.log(req.params.id)
    let {id} =req.params.id
    console.log(id)
    let idColor = await Color.findOne({ id });
    if(!idColor) throw new AppError(409, "Color not exists", "Register Error");
  
    let itemName = await Color.findOne({ listItem });
    if (itemName) throw new AppError(409, "Item already exists", "Register Error");
  
    idColor = await Color.updateOne({
        listItem,
    });
  
    return sendResponse(
      res,
      200,
      true,
      idColor,
      null,
      "Update Item successful"
    );
  });

module.exports = colorController