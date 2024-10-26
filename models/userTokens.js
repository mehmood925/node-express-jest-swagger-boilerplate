const { DataTypes } = require("sequelize");
const { sequelize } = require("../src/utils/database");
const UserToken = sequelize.define("userTokens", {
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});
module.exports = { UserToken };