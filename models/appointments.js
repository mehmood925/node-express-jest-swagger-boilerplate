const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/utils/database');
const Sequelize = DataTypes;
const Appointments = sequelize.define(
  'appointments',
  {
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
    title: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    appointment_time: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    doctor_name: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    location: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    reason: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    notes: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    notifications_enabled: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM(
        'pending',
        'completed',
        'cancelled',
        'missed',
        'rescheduled'
      ),
      allowNull: false,
    },
    is_deleted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
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
    tableName: 'appointments',
    timestamps: false,
    underscored: true,
  }
);

module.exports = { Appointments };
