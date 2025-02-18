const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/utils/database');
const Sequelize = DataTypes;
const UserMedicationSchedules = sequelize.define('user_medication_schedules', {
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
  scheduled_time: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  days_of_week: {
    type: Sequelize.JSONB,
    allowNull: false,
  },
});

module.exports = { UserMedicationSchedules };
