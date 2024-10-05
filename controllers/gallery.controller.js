const { AppError, catchAsync, sendResponse } = require("../helpers/utils");
const Gallery = require("../models/Gallery");
const galleryController = {};

galleryController.registerGallery = catchAsync(async (req, res, next) => {
  let { name } = req.body;

  let galleryName = await Gallery.findOne({ name });
  if (galleryName)
    throw new AppError(409, "Gallery already exists", "Register Error");

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
  const galleryId = req.query.id;
  let items = await Gallery.findById(galleryId).populate("listItem");
  items = items.listItem;
  return sendResponse(
    res,
    200,
    true,
    items,
    null,
    "Get Item By Gallery Id successful"
  );
});

galleryController.addItemToGallery = catchAsync(async (req, res, next) => {
  const galleryId = req.params.id;
  const { itemId } = req.body;

  const gallery = await Gallery.findById(galleryId);
  if (!gallery) {
    throw new AppError(404, "Gallery not found", "Add Item Error");
  }

  // Kiểm tra nếu item đã tồn tại trong gallery
  if (gallery.listItem.includes(itemId)) {
    throw new AppError(400, "Item already in gallery", "Add Item Error");
  }

  gallery.listItem.push(itemId);
  await gallery.save();

  // Populate danh sách items
  await gallery.populate("listItem");

  return sendResponse(
    res,
    200,
    true,
    gallery,
    null,
    "Add Item to Gallery successful"
  );
});

galleryController.deleteGallery = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Tìm và xóa Gallery
  const deletedGallery = await Gallery.findByIdAndDelete(id);

  if (!deletedGallery) {
    throw new AppError(404, "Gallery not found", "Delete Gallery Error");
  }

  // Nếu cần, bạn có thể xử lý thêm các logic liên quan, ví dụ như xóa tất cả các items trong Gallery
  // hoặc chỉ xóa mối liên kết giữa Gallery và các items.

  return sendResponse(
    res,
    200,
    true,
    deletedGallery,
    null,
    "Delete Gallery successful"
  );
});
module.exports = galleryController;
