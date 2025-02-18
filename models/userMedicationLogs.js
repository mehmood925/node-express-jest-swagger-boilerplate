const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/utils/database');
const Sequelize = DataTypes;
const UserMedicationLogs = sequelize.define('user_medication_logs', {
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
  medication_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'medications',
      key: 'id',
    },
  },
  status: {
    type: Sequelize.ENUM('skipped', 'taken', 'missed'),
    allowNull: false,
  },
  taken_at: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  snoozed: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
});

module.exports = { UserMedicationLogs };
