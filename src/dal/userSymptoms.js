// const ERROR_CODES = require('../constant/error-messages');
// const CustomError = require('../utils/error');
const { UserSymptoms } = require('../../models');
const { logger } = require('../utils/logger');
const Model = UserSymptoms;

class UserSymptomDal {
  static async create(params) {
    let response = await Model.create(params);
    return response;
  }

  static async findOne({ where, attributes, raw = true, include = [] }) {
    if (!Array.isArray(include)) include = [include];
    const response = await Model.findOne({
      where,
      attributes,
      include,
      raw,
    });
    return response;
  }

  static async findAll({
    where,
    attributes,
    page = 1,
    limit = 10,
    raw = true,
    include = [],
  }) {
    if (!Array.isArray(include)) include = [include];
    const offset = (page - 1) * limit;
    const response = await Model.findAndCountAll({
      where,
      attributes,
      include,
      raw,
      limit,
      offset,
    });

    return {
      data: response.rows,
      total: response.count,
      page,
      limit,
      totalPages: Math.ceil(response.count / limit),
    };
  }
}

module.exports = { UserSymptomDal };
