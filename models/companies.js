const { DataTypes } = require("sequelize");
const { sequelize } = require("../src/utils/database");
const Company = sequelize.define("companies", {
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
});

module.exports = { Company };