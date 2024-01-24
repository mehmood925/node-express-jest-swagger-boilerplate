const ERROR_CODES = require("../constant/error-messages");
const CustomError = require("../utils/error");
const { Account } = require("../../models");

class AccountsService {
  static async register(params) {
    await Account.create(params);
    return true;
  }

  static async getAccountsInfo(params) {
    const _accounts = await Account.findAll({
      where: { userId: params.id },
      raw: true,
    });
    return _accounts;
  }

  static async updateBalance(params) {
    await Account.update({
      balance: params.balance,
    }, { where: { id: params.id } });
    return true;
  }

  static async delete(params) {
    await Account.destroy({
      where: {id: params.id}
    });
    return true;
  }
}
module.exports = { AccountsService };
