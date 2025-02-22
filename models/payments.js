const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/utils/database');
const Sequelize = DataTypes;
const Payments = sequelize.define(
  'payments',
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
    tableName: 'payments',
    timestamps: false,
    underscored: true,
  }
);

module.exports = { Payments };
