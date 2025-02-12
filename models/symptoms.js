const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/utils/database');
const Sequelize = DataTypes;
const Symptoms = sequelize.define('symptoms', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  symptom: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
});

module.exports = { Symptoms };
