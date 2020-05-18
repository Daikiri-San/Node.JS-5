const { Router } = require("express");
const { AuthController } = require("./auth.controller");
const { upload, compressImage } = require("./upload.middlewares");

const authRouter = Router();

authRouter.post(
  "/register",
  upload.single("avatar"),
  AuthController.validateUser,
  compressImage,
  AuthController.registerUser
);

authRouter.post(
  "/login",
  AuthController.validateUser,
  AuthController.logInUser
);

authRouter.patch("/logout", AuthController.authorize, AuthController.logOut);

module.exports = {
  authRouter,
};
