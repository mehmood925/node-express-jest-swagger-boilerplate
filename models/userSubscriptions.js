const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/utils/database');
const Sequelize = DataTypes;
const UserSubscriptions = sequelize.define('user_subscriptions', {
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
  is_active: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  start_date: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  end_date: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  auto_renewal_enabled: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },
});

module.exports = { UserSubscriptions };
