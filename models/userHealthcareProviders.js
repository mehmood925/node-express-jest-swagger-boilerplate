const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/utils/database');
const Sequelize = DataTypes;
const UserHealthcareProviders = sequelize.define('user_healthcare_providers', {
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
  name: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  type: {
    type: Sequelize.ENUM('pharmacy', 'hospital', 'clinic', 'other'),
    allowNull: false,
  },
  address: {
    type: Sequelize.JSONB,
    allowNull: false,
  },
  lat: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  long: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  contact_info: {
    type: Sequelize.JSONB,
    allowNull: false,
  },
  rating: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
});

module.exports = { UserHealthcareProviders };
