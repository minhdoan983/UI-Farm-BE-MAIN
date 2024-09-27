const { AppError, catchAsync, sendResponse } = require("../helpers/utils");
const Gallery = require("../models/Gallery");
const galleryController = {};

galleryController.registerGallery = catchAsync(async (req, res, next) => {
  let { name } = req.body;

  let galleryName = await Gallery.findOne({ name });
  if (galleryName) throw new AppError(409, "Gallery already exists", "Register Error");

  galleryName = await Gallery.create({
    name,
  });

  return sendResponse(
    res,
    200,
    true,
    galleryName,
    null,
    "Create Gallery successful"
  );
});


galleryController.getAllGallery = catchAsync(async (req, res, next) => {
  let galleries = await Gallery.find();
  return sendResponse(
    res,
    200,
    true,
    galleries,
    null,
    "Get All Gallery successful"
  );
});

galleryController.getItemByGalleryId = catchAsync(async (req, res, next) => {
  const galleryId = req.query.id
  let items = await Gallery.findById(galleryId).populate('listItem');
  items=items.listItem
  return sendResponse(
    res,
    200,
    true,
    items,
    null,
    "Get Item By Gallery Id successful"
  );
});
module.exports = galleryController