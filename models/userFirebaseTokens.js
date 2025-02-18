const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/utils/database');
const Sequelize = DataTypes;
const UserFirebaseTokens = sequelize.define('user_firebase_tokens', {
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
  device_id: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  firebase_token_id: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
});

module.exports = { UserFirebaseTokens };
