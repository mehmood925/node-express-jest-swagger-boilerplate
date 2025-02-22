const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/utils/database');
const Sequelize = DataTypes;
const LabValues = sequelize.define(
  'lab_values',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
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
    description: {
      type: Sequelize.TEXT,
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
    created_at: {
      type: Sequelize.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false,
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false,
    },
  },
  {
    tableName: 'lab_values',
    timestamps: false,
    underscored: true,
  }
);

module.exports = { LabValues };
