// const ERROR_CODES = require('../constant/error-messages');
// const CustomError = require('../utils/error');
const { UserToken } = require('../../models/index');
const { logger } = require('../utils/logger');

class UserTokenDal {
  static async findOne(_params) {
    const _response = await UserToken.findOne({
      where: _params.where,
      attributes: _params.attributes,
      raw: true,
    });
    return _response;
  }

  static async findAll(_params) {
    const _response = await UserToken.findAll({
      where: _params.where,
      attributes: _params.attributes,
      raw: true,
    });
    return _response;
  }

  static async create(_params) {
    let _response = await UserToken.create(_params);
    return _response.id;
  }
}

module.exports = { UserTokenDal };
