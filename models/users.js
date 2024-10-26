const { DataTypes } = require("sequelize");
const { sequelize } = require("../src/utils/database");

const User = sequelize.define(
  "users",
  {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: false,
      validate: {
        is: {
          args: /^\+([1-9]{1}[0-9]{0,2})\d{6,14}$/, // Regex pattern for phone format
          msg: "Phone number must be in the format +123456789",
        },
      },
    },
    role: {
      type: DataTypes.ENUM("admin", "user"),
      allowNull: false,
    },
  },
);

module.exports = { User };
