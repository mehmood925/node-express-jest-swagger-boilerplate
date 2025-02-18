const { UserService } = require('../service/user');
const { logger } = require('../utils/logger');
const { responseHandler } = require('../utils/response');
class UserController {
  static async register(req, res, next) {
    try {
      const response = await UserService.register(req.body);
      return responseHandler({
        response: res,
        result: response,
      });
    } catch (error) {
      logger.info(`=====> ERROR REGISTER API`);
      logger.info(error.message);
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const response = await UserService.login(req.body);
      return responseHandler({
        response: res,
        result: response,
      });
    } catch (error) {
      logger.info(`=====> ERROR REGISTER API`);
      logger.info(error.message);
      next(error);
    }
  }

  static async getProfile(req, res, next) {
    try {
      const response = await UserService.getProfile(req.headers.loggedUser);
      return responseHandler({
        response: res,
        result: response,
      });
    } catch (error) {
      logger.info(`=====> ERROR REGISTER API`);
      logger.info(error.message);
      next(error);
    }
  }

  static async verifyToken(req, res, next) {
    try {
      const result = await AdminService.verifyToken({token: req.query.token});
      return responseHandler({
        response: res,
        result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updatePassword(req, res, next) {
    try {
      req.body.loggedUser = req.loggedUser;
      const response = await UserService.updatePassword(req.body);
      return responseHandler({
        response: res,
        result: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async forgetPassword(req, res, next) {
    try {
      req.body.loggedUser = req.loggedUser;
      const result = await AdminService.forgetPassword(req.body);
      return responseHandler({
        response: res,
        result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req, res, next) {
    try {
      req.body.loggedUser = req.loggedUser;
      const result = await AdminService.resetPassword(req.body);
      return responseHandler({
        response: res,
        result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = { UserController };
