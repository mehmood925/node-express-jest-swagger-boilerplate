const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/utils/database');
const Sequelize = DataTypes;
const UserLabValues = sequelize.define('user_lab_values', {
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
  lab_value_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'lab_values',
      key: 'id',
    },
  },
  reading: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  logged_at: {
    type: Sequelize.DATE,
    allowNull: false,
  },
});

module.exports = { UserLabValues };
