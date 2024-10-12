const {
  AppError,
  catchAsync,
  sendResponse,
} = require("../helpers/utils");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const authController = {};
const jwt = require("jsonwebtoken");

authController.loginWithEmail = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }, "+password");
  if (!user)
    return next(new AppError(400, "Invalid credentials", "Login Error"));

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return next(new AppError(400, "Wrong password", "Login Error"));

  accessToken = await user.generateToken();
  return sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Login successful"
  );
});
authController.loginWithGoogle = catchAsync(async (req, res, next) => {
  const { credentialResponse } = req.body;
  console.log(credentialResponse)
  const decodedToken = jwt.decode(credentialResponse.credential);
  console.log(decodedToken)
  let { email, name, sub: googleId } = decodedToken;
  let user = await User.findOne({ email });
  if (!user) {
    let password
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(googleId, salt);
    user = await User.create({
      name,
      email,
      password,
      phone:''
    });
  }
  const accessToken = await user.generateToken();

  return sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Login with Google Acount successful"
  );
});
module.exports = authController;