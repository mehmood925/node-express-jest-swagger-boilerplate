const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/utils/database');
const Sequelize = DataTypes;
const AiHealthLogs = sequelize.define('ai_health_logs', {
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
  query: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  response: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
});

module.exports = { AiHealthLogs };
