const mongoose = require("mongoose");

const { AppError, catchAsync, sendResponse } = require("../helpers/utils");
const Item = require("../models/Item");
const Gallery = require("../models/Gallery");
const itemController = {};

itemController.register = catchAsync(async (req, res, next) => {
  let { name, material, price, color, imgUrl } = req.body;
  console.log({ name, material, price, color, imgUrl });
  let item = await Item.findOne({ name });
  if (item) throw new AppError(409, "Item already exists", "Register Error");

  item = await Item.create({
    name,
    material,
    price,
    color,
    imgUrl,
  });

  return sendResponse(res, 200, true, item, null, "Create item successful");
});

itemController.getItems = catchAsync(async (req, res, next) => {
  var item = await Item.find({});
  // let item = await Item.find({})
  return sendResponse(res, 200, true, item, null, "Get item successful");
});

itemController.filterItems = catchAsync(async (req, res, next) => {
  const minPrice = req.query.min_price ? Number(req.query.min_price) : 0;
  const maxPrice = req.query.max_price ? Number(req.query.max_price) : Infinity;
  const colorName = req.query.with_color || null;
  const gallery = req.query.with_gallery || null;
  let filterItems;
  let totalItems;
  const PAGE_SIZE = 10;
  const page = parseInt(req.query.page) || 1;

  if (gallery !== null) {
    const galleryData = await Gallery.findOne({ name: gallery }).populate(
      "listItem"
    );

    if (galleryData) {
      console.log(galleryData);
      totalItems = galleryData.listItem.filter(
        (item) =>
          item.price >= minPrice &&
          item.price <= maxPrice &&
          (!colorName || item.color === colorName)
      ).length;

      filterItems = await Gallery.findOne({ name: gallery }).populate({
        path: "listItem",
        match: {
          price: { $gte: minPrice, $lte: maxPrice },
          ...(colorName ? { color: colorName } : {}),
        },
        options: {
          skip: (page - 1) * PAGE_SIZE,
          limit: PAGE_SIZE,
        },
      });
      filterItems = filterItems.listItem;
    }
  } else {
    totalItems = await Item.countDocuments({
      price: { $gte: minPrice, $lte: maxPrice },
      ...(colorName ? { color: colorName } : {}),
    });

    filterItems = await Item.find({
      price: { $gte: minPrice, $lte: maxPrice },
      ...(colorName ? { color: colorName } : {}),
    })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE);
  }
  return sendResponse(
    res,
    200,
    true,
    { items: filterItems, totalItems },
    null,
    "Filtered items retrieved"
  );
});

itemController.getItemsById = catchAsync(async (req, res, next) => {
  const ItemId = req.query.id;
  console.log(ItemId);
  const items = await Item.findById(ItemId).populate("material");

  return sendResponse(
    res,
    200,
    true,
    items,
    null,
    "Get Items by Price successful"
  );
});
itemController.getItemsBySearch = catchAsync(async (req, res, next) => {
  const searchValue = req.query.with_search;
  console.log(searchValue);

  if (searchValue) {
    const items = await Item.aggregate([
      {
        $lookup: {
          from: "colors",
          localField: "color",
          foreignField: "name",
          as: "colorDetails",
        },
      },
      {
        $lookup: {
          from: "materials",
          localField: "material",
          foreignField: "_id",
          as: "materialDetails",
        },
      },
      {
        $lookup: {
          from: "galleries", 
          localField: "_id",
          foreignField: "listItem", 
          as: "galleryDetails",
        },
      },
      {
        $match: {
          $or: [
            { name: { $regex: searchValue, $options: "i" } }, 
            { color: { $regex: searchValue, $options: "i" } }, 
            { "materialDetails.name": { $regex: searchValue, $options: "i" } }, 
            { "galleryDetails.name": { $regex: searchValue, $options: "i" } }, 
          ],
        },
      },
    ]);

    return sendResponse(
      res,
      200,
      true,
      items,
      null,
      "Get Items by Search successful"
    );
  } else {
    return sendResponse(res, 400, false, null, "Invalid search query");
  }
});

itemController.updateItem = catchAsync(async (req, res, next) => {
  const { id } = req.params; 
  const { name, material, price, color, imgUrl } = req.body; 

  const updatedItem = await Item.findByIdAndUpdate(
    id,
    {
      name,
      material,
      price,
      color,
      imgUrl,
    },
    { new: true } 
  );

  if (!updatedItem) {
    throw new AppError(404, "Item not found", "Update Error");
  }

  return sendResponse(
    res,
    200,
    true,
    updatedItem,
    null,
    "Update item successful"
  );
});
itemController.deleteItem = catchAsync(async (req, res, next) => {
  const { id } = req.params; 

  const deletedItem = await Item.findByIdAndDelete(id);

  if (!deletedItem) {
    throw new AppError(404, "Item not found", "Delete Error");
  }

  return sendResponse(res, 200, true, null, null, "Delete item successful");
});

module.exports = itemController;
