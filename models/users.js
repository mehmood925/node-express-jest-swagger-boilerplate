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
  firstName: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  lastName: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  username: {
    type: Sequelize.STRING(255),
    unique: true,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING(255),
    unique: true,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  phone: {
    type: Sequelize.STRING(15),
  },
  roleId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'roles',
      key: 'id',
    },
  },
  isActive: {
    type: Sequelize.BOOLEAN,
  },
  emailVerificationOTP: {
    type: Sequelize.NUMBER,
  },
  emailVerificationOTPExpiry: {
    type: Sequelize.STRING,
  },
  emailVerified: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  phoneVerificationOTP: {
    type: Sequelize.NUMBER,
  },
  phoneVerificationOTPExpiry: {
    type: Sequelize.NUMBER,
  },
  phoneVerified: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  inAppNotifications: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
  pushNotifications: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
  emailNotifications: {
      type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
  smsNotifications: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
  forgotPasswordOTP: {
    type: Sequelize.NUMBER,
  },
  forgotPasswordOTPExpiry: {
    type: Sequelize.NUMBER,
  },
  forgotPasswordOTPVerified: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  resetPasswordExpiry: {
    type: Sequelize.NUMBER,
  },
  timezone: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
});

module.exports = { Users };
