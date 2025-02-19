const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/utils/database');
const Sequelize = DataTypes;
const MedicationBarcodes = sequelize.define(
  'medication_barcodes',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    medication_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'medications',
        key: 'id',
      },
    },
    barcode: {
      type: Sequelize.STRING(20),
      allowNull: false,
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
    tableName: 'medication_barcodes',
    timestamps: false,
    underscored: true,
  }
);

module.exports = { MedicationBarcodes };
