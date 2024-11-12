const _express = require('express');
const _router = _express.Router();
const _controller = require('../controllers/user');
const _validationMiddleware = require('../middleware/validation');
const _valdations = require('../validations/user');
const { authMiddleware } = require('../middleware/auth');
const _CONSTANTS = require('../constant/constant');
_router.post(
  '/register',
  _validationMiddleware(_valdations.register),
  _controller.register
);
_router.post(
  '/login',
  _validationMiddleware(_valdations.login),
  _controller.login
);
_router.get(
  '/getProfile',
  authMiddleware([_CONSTANTS.ADMIN]),
  _controller.getProfile
);
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

module.exports = _router;
