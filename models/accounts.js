const { DataTypes } = require("sequelize");
const { sequelize } = require("../src/utils/database");
const Account = sequelize.define("accounts", {
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
      model: 'admins',
      key: 'id',
    },
  },
  accountNo: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  balance: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
});

module.exports = { Account };