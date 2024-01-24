const { Company } = require("./companies");
const { Admin } = require("./admins");
const { Account } = require("./accounts");

// Define association between Company and Admin models
Company.hasMany(Admin, { as: "admins", foreignKey: "companyId" });
Admin.belongsTo(Company, { as: "company", foreignKey: "companyId" });

// Define association between Admin and Account models
Admin.hasMany(Account, {
  as: "accounts",
  foreignKey: "userId",
  sourceKey: "id",
});
Account.belongsTo(Admin, {
  as: "owner",
  foreignKey: "userId",
  sourceKey: "id",
});

module.exports = {
  Company,
  Admin,
  Account,
};
