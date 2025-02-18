const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/utils/database');
const Sequelize = DataTypes;
const LabValues = sequelize.define('lab_values', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  title: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  unit: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  min_safe_value: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  max_safe_value: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
});

module.exports = { LabValues };
