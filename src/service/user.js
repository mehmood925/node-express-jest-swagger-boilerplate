const jwt = require('jsonwebtoken');
const passCom = require('joi-password-complexity');
const bcrypt = require('bcrypt');
const ERROR_CODES = require("../constant/error-messages");
const { CONSTANTS } = require("../constant/constant");
const CustomError = require("../utils/error");
const { UserDal } = require("../dal/user");
const { generateTokens } = require('../middleware/auth');
const complexityOptions = {
  min: 8,
  max: 26,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
};

class UserService {
  static async register(params) {
    const existingProfile = await UserDal.findOne(params);
    if (existingProfile) {
      throw new CustomError(ERROR_CODES.USER_ALREADY_EXISTS);
    }
    const pass = passCom(complexityOptions).validate(params.password);
    if (pass.error) {
      throw new CustomError(ERROR_CODES.PASS_RULES_ERROR);
    }
    const _user = await UserDal.create({
      email: params.email,
      password: bcrypt.hashSync(params.password, bcrypt.genSaltSync(2)),
      role: CONSTANTS.USER
    });
    const { accessToken, refreshToken } = generateTokens({
      id: _user.id,
      email: _user.email,
      role: _user.role,
    });
   
    return { accessToken, refreshToken };
  }

  static async getAll(params) {
    const offset = (params.page - 1) * params.limit;
    const _response = await UserDal.findAll({
      offset,
      limit
    });
    return _response;
  }

  static async findById(params) {
    const _response = await UserDal.findById(params);
    return _response;
  }
}
module.exports = UserService;
