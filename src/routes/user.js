const express = require('express');
const router = express.Router();
const { UserController } = require('../controllers/user');
const validationMiddleware = require('../middleware/validation');
const userValdations = require('../validations/user');
const { authMiddleware } = require('../middleware/auth');
const CONSTANTS = require('../constant/constant');

router.post(
  '/register',
  //validationMiddleware(userValdations.register),
  UserController.register
);
router.post(
  '/login',
  validationMiddleware(userValdations.login),
  UserController.login
);
router.get(
  '/getProfile',
  authMiddleware([CONSTANTS.USER]),
  UserController.getProfile
);
router.get('/verifyResetPasswordToken', UserController.verifyToken);
router.patch(
  '/updatePassword',
  authMiddleware,
  validationMiddleware(userValdations.updatePassword),
  UserController.updatePassword
);

router.post(
  '/forgetPassword',
  validationMiddleware(userValdations.forgetPassword),
  UserController.forgetPassword
);
router.post(
  '/resetPassword',
  validationMiddleware(userValdations.resetPassword),
  UserController.resetPassword
);

module.exports = router;
