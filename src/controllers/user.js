const service = require("../service/user");
const { responseHandler } = require("../utils/response");
class Controller {
  static async register(req, res, next) {
    try {
      const _response = await service.register(req.body);
      return responseHandler({
        response: res,
        result: _response,
      });
    } catch (error) {
      next(error);
    }
  }
  
  static async login(req, res, next) {
    try {
      const _response = await service.login(req.body);
      return responseHandler({
        response: res,
        result: _response,
      });
    } catch (error) {
      next(error);
    }
  }
  
  static async getProfile(req, res, next) {
    try {
      const result = await service.getProfile(req.headers.loggedUser);
      return responseHandler({
        response: res,
        result,
      });
    } catch (error) {
      next(error);
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
  //     const result = await AdminService.updatePassword(req.body);
  //     return responseHandler({
  //       response: res,
  //       result,
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

module.exports = Controller
