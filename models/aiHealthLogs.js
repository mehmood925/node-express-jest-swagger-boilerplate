const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/utils/database');
const Sequelize = DataTypes;
const AiHealthLogs = sequelize.define(
  'ai_health_logs',
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
    query: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    response: {
      type: Sequelize.TEXT,
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
    tableName: 'ai_health_logs',
    timestamps: false,
    underscored: true,
  }
);

module.exports = { AiHealthLogs };
