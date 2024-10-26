const express = require("express");
const router = express.Router();
const controller = require("../controllers/user");
const validationMiddleware = require("../middleware/validation");
const valdations = require("../validations/user");
const { authMiddleware } = require("../middleware/auth");
const CONSTANTS = require("../constant/constant")
router.post(
  "/register",
  validationMiddleware(valdations.register),
  controller.register
);
router.post(
  "/login",
  validationMiddleware(valdations.login),
  controller.login
);
router.get("/getProfile", authMiddleware([CONSTANTS.USER]), controller.getProfile);
// router.get("/verifyResetPasswordToken", controller.verifyToken);
// router.patch(
//   "/updatePassword",
//   authMiddleware,
//   validationMiddleware(valdations.updatePassword),
//   controller.updatePassword
// );
// router.post("/forgetPassword", validationMiddleware(valdations.forgetPassword),
// controller.forgetPassword);
// router.post("/resetPassword", validationMiddleware(valdations.resetPassword),
// controller.resetPassword);

module.exports = router;
