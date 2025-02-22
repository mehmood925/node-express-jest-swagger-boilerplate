const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/utils/database');
const Sequelize = DataTypes;
const Medications = sequelize.define(
  'medications',
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
    manufacturer: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    strength: {
      type: Sequelize.JSONB,
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
    tableName: 'medications',
    timestamps: false,
    underscored: true,
  }
);

module.exports = { Medications };
