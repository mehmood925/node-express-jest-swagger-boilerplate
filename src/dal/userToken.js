// const ERROR_CODES = require('../constant/error-messages');
// const CustomError = require('../utils/error');
const { UserToken } = require("../../models/index");
const { logger } = require("../utils/logger");


class UserTokenDal {
  static async findOne(params) {
    const _response = await UserToken.findOne({
      where: params.where,
      attributes: params.attributes,
      raw: true,
    });
    return _response;
  }

  static async findAll(params) {
    const _response = await UserToken.findAll({
      where: params.where,
      attributes: params.attributes,
      raw: true,
    });
    return _response;
  }

  static async create(params) {
    let _response = await UserToken.create(params);
    return _response.id;
  }

}

module.exports = { UserTokenDal };
