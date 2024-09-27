const express = require("express");
const router = express.Router();
const validators = require("../middlewares/validators");
const galleryController = require("../controllers/gallery.controller");
const { body, param } = require("express-validator");

router.post(
  "/",
  validators.validate([
    body("name", "Invalid name").exists().notEmpty(),
  ]),
  galleryController.registerGallery
);

router.get(
  "/",
  galleryController.getAllGallery
);

router.get(
  "/id/",
  galleryController.getItemByGalleryId
);
module.exports = router;