const { UserModel } = require("./users");
const { UserTokenModel } = require("./userTokens");
// Define association between Company and Admin models
UserModel.hasMany(UserTokenModel, { as: "users_userTokens", foreignKey: "userId" });
UserTokenModel.belongsTo(UserModel, { as: "userTokens_users", foreignKey: "userId" });

module.exports = {
  User: UserModel,
  UserToken: UserTokenModel,
};
