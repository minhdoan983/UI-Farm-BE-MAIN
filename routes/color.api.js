const express = require("express");
const router = express.Router();
const validators = require("../middlewares/validators");
const colorController = require("../controllers/color.controller");
const { body, param } = require("express-validator");

router.post(
    "/colorName",
    validators.validate([
      body("name", "Invalid name").exists().notEmpty(),
    ]),
    colorController.registerColor
  );

  router.put(
    "/itemName/:id",
    validators.validate([
      body("listItem", "Invalid Item").exists().notEmpty(),
    ]),
    colorController.registerItems
  );

  module.exports = router;