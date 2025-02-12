const { UserService } = require('../service/user');
const { logger } = require('../utils/logger');
const { responseHandler } = require('../utils/response');
class UserController {
  static async register(_req, _res, _next) {
    try {
      const _response = await UserService.register(_req.body);
      return responseHandler({
        response: _res,
        result: _response,
      });
    } catch (_error) {
      logger.info(`=====> ERROR REGISTER API`);
      logger.info(_error.message);
      _next(_error);
    }
  }

  static async login(_req, _res, _next) {
    try {
      const _response = await UserService.login(_req.body);
      return responseHandler({
        response: _res,
        result: _response,
      });
    } catch (_error) {
      logger.info(`=====> ERROR REGISTER API`);
      logger.info(_error.message);
      _next(_error);
    }
  }

  static async getProfile(_req, _res, _next) {
    try {
      const _response = await UserService.getProfile(_req.headers.loggedUser);
      return responseHandler({
        response: _res,
        result: _response,
      });
    } catch (_error) {
      logger.info(`=====> ERROR REGISTER API`);
      logger.info(_error.message);
      _next(_error);
    }
  }

  // static async verifyToken(req, res, next) {
  //   try {
  //     const result = await AdminService.verifyToken({token: req.query.token});
  //     return responseHandler({
  //       response: res,
  //       result,
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  // static async updatePassword(req, res, next) {
  //   try {
  //     req.body.loggedUser = req.loggedUser;
  //     const _response = await UserService.updatePassword(req.body);
  //     return responseHandler({
  //       response: res,
  //       result: _response,
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  // static async forgetPassword(req, res, next) {
  //   try {
  //     req.body.loggedUser = req.loggedUser;
  //     const result = await AdminService.forgetPassword(req.body);
  //     return responseHandler({
  //       response: res,
  //       result,
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  // static async resetPassword(req, res, next) {
  //   try {
  //     req.body.loggedUser = req.loggedUser;
  //     const result = await AdminService.resetPassword(req.body);
  //     return responseHandler({
  //       response: res,
  //       result,
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // }
}

module.exports = { UserController };
