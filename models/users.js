const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/utils/database');

const UserModel = sequelize.define('users', {
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  emailVerificationOTP: {
    type: DataTypes.STRING(255),
  },
  emailVerificationOTPExpiry: {
    type: DataTypes.BIGINT,
  },
  emailVerified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  phone: {
    type: DataTypes.STRING(15),
  },
  phoneVerificationOTP: {
    type: DataTypes.STRING(255),
  },
  phoneVerificationOTPExpiry: {
    type: DataTypes.BIGINT,
  },
  phoneVerified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  forgetPasswordOTP: {
    type: DataTypes.STRING(255),
  },
  forgetPasswordOTPExpiry: {
    type: DataTypes.BIGINT,
  },
  forgetPasswordVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  resetPasswordExpiry: {
    type: DataTypes.BIGINT,
  },
  emailNotifications: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  phoneNotifications: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  pushNotifications: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  inAppNotifications: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  role: {
    type: DataTypes.ENUM('superAdmin', 'admin', 'agent', 'merchant'),
    allowNull: false,
    defaultValue: 'merchant',
  },
});

module.exports = { UserModel };
