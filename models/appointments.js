const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/utils/database');
const Sequelize = DataTypes;
const AppointmentsModel = sequelize.define('appointments', {
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
  doctorName: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  appointmentDate: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  notes: {
    type: Sequelize.TEXT,
  },
});

module.exports = { AppointmentsModel };
