const { AppError, catchAsync, sendResponse } = require("../helpers/utils");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const userController = {};

userController.register = catchAsync(async (req, res, next) => {
  let { name, email, phone, password } = req.body;

  let user = await User.findOne({ email });
  if (user) throw new AppError(409, "User already exists", "Register Error");

  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  user = await User.create({
    name,
    email,
    phone,
    password,
  });
  const accessToken = await user.generateToken();

  return sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Create user successful"
  );
});
userController.getCurrentUser = catchAsync(async (req, res, next) => {
  const userId = req.userId;

  const user = await User.findById(userId);
  if (!user)
    throw new AppError(400, "User not found", "Get Current User Error");

  return sendResponse(
    res,
    200,
    true,
    user,
    null,
    "Get current user successful"
  );
});
userController.updateProfile = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  const user = await User.findById(userId);
  if (!user)
    throw new AppError(404, "Account not found", "Update Profile Error");

  const allows = [
    "name",
    "avatarUrl",
  ];
  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  });

  await user.save();
  return sendResponse(
    res,
    200,
    true,
    user,
    null,
    "Update Profile successfully"
  );
});

module.exports = userController