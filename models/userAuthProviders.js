const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/utils/database');
const Sequelize = DataTypes;
const UserAuthProviders = sequelize.define(
  'user_auth_providers',
  {
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
    provider: {
      type: Sequelize.ENUM('email', 'google', 'apple'),
      allowNull: false,
    },
    social_id: {
      type: Sequelize.STRING(255),
      allowNull: true,
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
    tableName: 'user_auth_providers',
    timestamps: false,
    underscored: true,
  }
);

module.exports = { UserAuthProviders };
