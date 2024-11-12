// const ERROR_CODES = require('../constant/error-messages');
// const CustomError = require('../utils/error');
const { User } = require('../../models/index');
const { logger } = require('../utils/logger');

class UserDal {
  static async findOne(_params) {
    const _response = await User.findOne({
      where: _params.where,
      attributes: _params.attributes,
      raw: true,
    });
    return _response;
  }

  static async create(_params) {
    let _response = await User.create(_params);
    return _response.id;
  }
}

module.exports = { UserDal };
