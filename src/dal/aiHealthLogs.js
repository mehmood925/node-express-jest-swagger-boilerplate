// const ERROR_CODES = require('../constant/error-messages');
// const CustomError = require('../utils/error');
const { AiHealthLogs } = require('../../models');
const { logger } = require('../utils/logger');
const Model = AiHealthLogs;

class AiHealthLogDal {
  static async create(params) {
    let response = await AiHealthLogs.create(params);
    return response;
  }

  static async findOne({ where, attributes, raw = true, include = [] }) {
    if (!Array.isArray(include)) include = [include];
    const response = await AiHealthLogs.findOne({
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
    const response = await AiHealthLogs.findAndCountAll({
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

module.exports = { AiHealthLogDal };
