const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/utils/database');
const Sequelize = DataTypes;
const UserSubscriptions = sequelize.define(
  'user_subscriptions',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    subscription_id: {
      type: Sequelize.UUID,
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
    created_at: {
      type: Sequelize.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false,
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false,
    },
  },
  {
    tableName: 'user_subscriptions',
    timestamps: false,
    underscored: true,
  }
);

module.exports = { UserSubscriptions };
