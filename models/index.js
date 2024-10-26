const { User } = require("./users");
const { UserToken } = require("./userTokens");

// Define association between Company and Admin models
User.hasMany(UserToken, { as: "users_userTokens", foreignKey: "userId" });
UserToken.belongsTo(User, { as: "userTokens_users", foreignKey: "userId" });

module.exports = {
  User,
  UserToken,
};
