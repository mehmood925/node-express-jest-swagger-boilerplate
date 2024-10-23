const express = require("express");
const router = express.Router();
const controller = require("../controllers/user");
const validationMiddleware = require("../middleware/validation");
const validation = require("../validations/user");
const { authMiddleware } = require("../middleware/auth");

router.post(
  "/register",
  validationMiddleware(validation.register),
  controller.register
);
router.post(
  "/login",
  validationMiddleware(validation.login),
  controller.login
);
router.get("/getProfile", authMiddleware, controller.getProfile);
router.get("/verifyResetPasswordToken", controller.verifyToken);
router.patch(
  "/updatePassword",
  authMiddleware,
  validationMiddleware(validation.updatePassword),
  controller.updatePassword
);
router.post("/forgetPassword", validationMiddleware(validation.forgetPassword),
controller.forgetPassword);
router.post("/resetPassword", validationMiddleware(validation.resetPassword),
controller.resetPassword);

module.exports = router;
