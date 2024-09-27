const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authentication");
const userController = require("../controllers/user.controller");
const validators = require("../middlewares/validators");
const { body, param } = require("express-validator");

/**
 * @route POST /users
 * @description Register new user
 * @access Public
 */
router.post(
  "/",
  validators.validate([
    body("name", "Invalid name").exists().notEmpty(),
    body("email", "Invalid email")
      .exists()
      .isEmail()
      .normalizeEmail({ gmail_remove_dots: false }),
    body("phone", "Invalid phone").exists().notEmpty(),
    body("password", "Invalid password").exists().notEmpty(),
  ]),
  userController.register
);

router.get(
  "/me",
  authMiddleware.loginRequired,
  userController.getCurrentUser
);

router.put("/:id", authMiddleware.loginRequired, userController.updateProfile);

module.exports = router;