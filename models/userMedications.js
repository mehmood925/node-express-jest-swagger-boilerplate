const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/utils/database');
const Sequelize = DataTypes;
const UserMedications = sequelize.define('userMedications', {
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
  medicationId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'medications',
      key: 'id',
    },
  },
  dosage: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  frequency: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  reminder: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
  },
  reminderSchedule: {
    type: Sequelize.JSONB,
  },
});

module.exports = { UserMedications };
