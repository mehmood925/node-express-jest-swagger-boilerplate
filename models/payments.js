const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/utils/database');
const Sequelize = DataTypes;
const Payments = sequelize.define('payments', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  subscription_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'subscriptions',
      key: 'id',
    },
  },
  amount: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  currency: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  payment_method: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  transaction_id: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  apple_transaction_id: {
    type: Sequelize.STRING(255),
    allowNull: true,
  },
  google_order_id: {
    type: Sequelize.STRING(255),
    allowNull: true,
  },
  status: {
    type: Sequelize.ENUM('initiated', 'success'),
    allowNull: false,
  },
});

module.exports = { Payments };
