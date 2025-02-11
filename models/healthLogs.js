const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/utils/database');
const Sequelize = DataTypes;
const HealthLogsModel = sequelize.define('healthLogs', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  symptom: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  severity: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  loggedAt: {
    type: Sequelize.DATE,
    allowNull: false,
  },
});

module.exports = { HealthLogsModel };
