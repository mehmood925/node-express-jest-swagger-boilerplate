const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/utils/database');
const Sequelize = DataTypes;
const UserSymptoms = sequelize.define('userSymptoms', {
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
  symptomId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'symptoms',
      key: 'id',
    },
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

module.exports = { UserSymptoms };
