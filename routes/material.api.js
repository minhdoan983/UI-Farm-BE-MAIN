const express = require("express");
const router = express.Router();
const validators = require("../middlewares/validators");
const materialController = require("../controllers/material.controller");
const { body, param } = require("express-validator");

router.post(
  "/",
  validators.validate([
    body("name", "Invalid name").exists().notEmpty(),
  ]),
  materialController.registerMaterial
);

router.put(
  "/itemName/:id",
  validators.validate([
    body("listItem", "Invalid Item").exists().notEmpty(),
  ]),
  materialController.registerItems
);

router.get(
  "/",
  materialController.getAllMaterial
);
module.exports = router;