const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/utils/database');
const Sequelize = DataTypes;
const Users = sequelize.define('users', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  role_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'roles',
      key: 'id',
    },
  },
  first_name: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  last_name: {
    type: Sequelize.STRING(255),
    allowNull: true,
  },
  username: {
    type: Sequelize.STRING(255),
    allowNull: true,
  },
  gender: {
    type: Sequelize.ENUM('male', 'female', 'other'),
    allowNull: false,
  },
  image: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  email: {
    type: Sequelize.STRING(255),
    unique: true,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING(255),
    allowNull: true,
  },
  phone: {
    type: Sequelize.STRING(20),
    allowNull: true,
  },
  age: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  date_of_birth: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  address: {
    type: Sequelize.JSONB,
    allowNull: true,
  },
  is_active: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },
  email_verified: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  phone_verified: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  in_app_notifications_enabled: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  push_notifications_enabled: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },
  email_notifications_enabled: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },
  sms_notifications_enabled: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  critical_notifications_enabled: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },
  timezone: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  is_deleted: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  activities: {
    type: Sequelize.JSONB,
    allowNull: true,
  },
});

module.exports = { Users };
