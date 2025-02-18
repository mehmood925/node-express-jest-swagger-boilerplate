const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/utils/database');
const Sequelize = DataTypes;
const Subscriptions = sequelize.define('subscriptions', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  title: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  type: {
    type: Sequelize.ENUM('monthly', 'annual'),
    allowNull: false,
  },
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  currency: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  validity_days: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = { Subscriptions };
