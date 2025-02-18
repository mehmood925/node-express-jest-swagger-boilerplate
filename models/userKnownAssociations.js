const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/utils/database');
const Sequelize = DataTypes;
const UserKnownAssociations = sequelize.define('user_known_associations', {
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
  type: {
    type: Sequelize.ENUM('allergy', 'condition'),
    allowNull: false,
  },
  value: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
});

module.exports = { UserKnownAssociations };
