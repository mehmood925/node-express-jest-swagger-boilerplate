const _express = require('express');
const _router = _express.Router();
const { UserController } = require('../controllers/user');
const _validationMiddleware = require('../middleware/validation');
const _userValdations = require('../validations/user');
const { authMiddleware } = require('../middleware/auth');
const _CONSTANTS = require('../constant/constant');
_router.post(
  '/register',
  _validationMiddleware(_userValdations.register),
  UserController.register
);
_router.post(
  '/login',
  _validationMiddleware(_userValdations.login),
  UserController.login
);
_router.get(
  '/getProfile',
  authMiddleware([_CONSTANTS.USER]),
  UserController.getProfile
);
// _router.get("/verifyResetPasswordToken", controller.verifyToken);
// _router.patch(
//   '/updatePassword',
//   authMiddleware,
//   _validationMiddleware(_userValdations.updatePassword),
//   UserController.updatePassword
// );

// router.post("/forgetPassword", validationMiddleware(valdations.forgetPassword),
// controller.forgetPassword);
// router.post("/resetPassword", validationMiddleware(valdations.resetPassword),
// controller.resetPassword);

module.exports = _router;
