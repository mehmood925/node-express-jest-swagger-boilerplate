const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/utils/database');
const Sequelize = DataTypes;
const MedicationBarcodes = sequelize.define('medication_barcodes', {
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
});

module.exports = { MedicationBarcodes };
