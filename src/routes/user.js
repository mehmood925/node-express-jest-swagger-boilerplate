const express = require('express');
const _router = express.Router();
const _controller = require('../controllers/user');
const validationMiddleware = require('../middleware/validation');
const valdations = require('../validations/user');
const { authMiddleware } = require('../middleware/auth');
const CONSTANTS = require('../constant/constant');
_router.post(
  '/register',
  validationMiddleware(valdations.register),
  _controller.register
);
_router.post('/login', validationMiddleware(valdations.login), _controller.login);
_router.get(
  '/getProfile',
  authMiddleware([CONSTANTS.ADMIN]),
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

module.exports = router;
