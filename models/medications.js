const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/utils/database');
const Sequelize = DataTypes;
const MeedicationsModel = sequelize.define('medications', {
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
  name: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  dosage: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  frequency: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
});

module.exports = { MeedicationsModel };
