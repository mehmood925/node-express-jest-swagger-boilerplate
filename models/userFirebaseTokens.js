const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/utils/database');
const Sequelize = DataTypes;
const UserFirebaseTokens = sequelize.define(
  'user_firebase_tokens',
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
    device_id: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    firebase_token_id: {
      type: Sequelize.STRING(255),
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
    tableName: 'user_firebase_tokens',
    timestamps: false,
    underscored: true,
  }
);

module.exports = { UserFirebaseTokens };
