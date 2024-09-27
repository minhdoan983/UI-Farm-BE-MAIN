const { AppError, catchAsync, sendResponse } = require("../helpers/utils");
const Material = require("../models/Material");
const materialController = {};

materialController.registerMaterial = catchAsync(async (req, res, next) => {
  let { name, listItem } = req.body;

  let materialName = await Material.findOne({ name });
  if (materialName) throw new AppError(409, "Material already exists", "Register Error");

  materialName = await Material.create({
    name,
    listItem
  });

  return sendResponse(
    res,
    200,
    true,
    materialName,
    null,
    "Create Material successful"
  );
});
materialController.registerItems = catchAsync(async (req, res, next) => {
  let { listItem } = req.body;
  let {id} =req.params.id
  console.log(id)
  let idMaterial = await Material.findOne({ id });
  console.log(idMaterial)
  if(!idMaterial) throw new AppError(409, "Material not exists", "Register Error");

  let itemName = await Material.findOne({ listItem });
  if (itemName) throw new AppError(409, "Item already exists", "Register Error");

  idMaterial = await Material.updateOne({
      listItem,
  });

  return sendResponse(
    res,
    200,
    true,
    idMaterial,
    null,
    "Update Item successful"
  );
});

module.exports = materialController