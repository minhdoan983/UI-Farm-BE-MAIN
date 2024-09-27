const mongoose = require('mongoose')

const { AppError, catchAsync, sendResponse } = require("../helpers/utils");
const Item = require("../models/Item");
const Gallery = require("../models/Gallery");
const itemController = {};

itemController.register = catchAsync(async (req, res, next) => {
  let { name, material, price, color, imgUrl } = req.body;

  let item = await Item.findOne({ name });
  if (item) throw new AppError(409, "Item already exists", "Register Error");

  item = await Item.create({
    name,
    material,
    price,
    color,
    imgUrl
  });

  return sendResponse(
    res,
    200,
    true,
    item,
    null,
    "Create item successful"
  );
});

itemController.getItems = catchAsync(async (req, res, next) => {
  let item = await Item.find({})
  return sendResponse(
    res,
    200,
    true,
    item,
    null,
    "Get item successful"
  )
})

itemController.getItemsByGallery = catchAsync(async (req, res, next) => {
  // const galleryName = req.query.with_gallery
  // const items =await Item.find({ gallery: galleryName })
  //   .populate({
  //     path:'gallery',
  //     match: {name : galleryName}
  //   })
  //   .then(items => {
  //     return items.filter(item => item.gallery && item.gallery.length > 0);
  //   })
  //   .catch(err => {
  //     console.error(err);
  //   });
  // return sendResponse(
  //   res,
  //   200,
  //   true,
  //   items,
  //   null,
  //   "Get Gallery successful1"
  // )
})

itemController.getItemsByColor = catchAsync(async (req, res, next) => {
  const colorName = req.query.with_color
  const items = await Item.find()
    .populate({
      path: 'color',
      match: { name: colorName }
    })
    .then(items => {
      return items.filter(item => item.color && item.color.length > 0);
    })
    .catch(err => {
      console.error(err);
    });
  return sendResponse(
    res,
    200,
    true,
    items,
    null,
    "Get Item by Color successful1"
  )
})

itemController.getItemsByPrice = catchAsync(async (req, res, next) => {
  const minPrice = req.query.min_price
  const maxPrice = req.query.max_price

  const priceQuery = {
    price: {
      $gt: minPrice,
      $lt: maxPrice
    }
  };

  const items = await Item.find(priceQuery).sort({ price: 1 });

  return sendResponse(
    res,
    200,
    true,
    items,
    null,
    "Get Items by Price successful"
  );
}
);

itemController.filterItems = catchAsync(async (req, res, next) => {
  const minPrice = req.query.min_price ? Number(req.query.min_price) : 0;
  const maxPrice = req.query.max_price ? Number(req.query.max_price) : Infinity;
  const colorName = req.query.with_color || null;
  const gallery = req.query.with_gallery || null;

  console.log('Received filters:', minPrice, maxPrice, colorName, gallery);

  let filterItems;

  if (gallery !== null) {
    filterItems = await Gallery.find({ name: gallery })
      .populate({
        path: 'listItem',
        match: {
          price: { $gte: minPrice, $lte: maxPrice },
          ...(colorName ? { color: colorName } : {})  
        }
      });
  } else {
    filterItems = await Item.find({
      price: { $gte: minPrice, $lte: maxPrice },
      ...(colorName ? { color: colorName } : {})  
    });
  }
  

  console.log('Filtered items:', filterItems);
  return sendResponse(res, 200, true, filterItems, null, "Filtered items retrieved");
});

itemController.getItemsById = catchAsync(async (req, res, next) => {
  const ItemId = req.query.id
  console.log(ItemId)
  const items = await Item.findById(ItemId).populate('material')

  return sendResponse(
    res,
    200,
    true,
    items,
    null,
    "Get Items by Price successful"
  );
}
);
itemController.getItemsBySearch = catchAsync(async (req, res, next) => {
  const searchValue = req.query.with_search; 
  console.log(searchValue);

  if (searchValue) {
    const items = await Item.aggregate([
      {
        $lookup: {
          from: 'colors', 
          localField: 'Color',
          foreignField: '_id',
          as: 'Color'
        }
      },
      {
        $lookup: {
          from: 'materials', 
          localField: 'material',
          foreignField: '_id',
          as: 'material'
        }
      },
      {
        $match: {
          $or: [
            { name: { $regex: searchValue, $options: 'i' } }, 
            { 'color.name': { $regex: searchValue, $options: 'i' } }, 
            { 'material.name': { $regex: searchValue, $options: 'i' } } 
          ]
        }
      }
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


module.exports = itemController