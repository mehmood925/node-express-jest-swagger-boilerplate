const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/utils/database');
const Sequelize = DataTypes;
const Roles = sequelize.define('roles', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  role: {
    type: Sequelize.ENUM('user', 'admin'),
    allowNull: false,
  },
});

module.exports = { Roles };
