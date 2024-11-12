// const ERROR_CODES = require('../constant/error-messages');
// const CustomError = require('../utils/error');
const { User } = require('../../models/index');
const { logger } = require('../utils/logger');

class UserDal {
  static async findOne(params) {
    const _response = await User.findOne({
      where: params.where,
      attributes: params.attributes,
      raw: true,
    });
    return _response;
  }

  static async create(params) {
    let _response = await User.create(params);
    return _response.id;
  }
}

module.exports = { UserDal };
