const ERROR_CODES = require("../constant/error-messages");
const CustomError = require("../utils/error");
const { Company, Admin } = require("../../models");

class CompanyService {
  static async register(params) {
    await Company.create(params);
    return true;
  }

  static async getCompeniesInfo() {
    const _accounts = await Company.findAll({
      nest: true, 
      where: {}, 
      include: [{ model: Admin, as: "admins", attributes: ['id', 'companyId', 'email'] }],
    });
    return _accounts;
  }

  static async delete(params) {
    await Company.destroy({
      where: {id: params.id}
    });
    return true;
  }
}
module.exports = { CompanyService };
