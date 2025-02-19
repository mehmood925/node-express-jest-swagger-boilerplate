const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/utils/database');
const Sequelize = DataTypes;
const UserSymptoms = sequelize.define(
  'user_symptoms',
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
    symptom_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'symptoms',
        key: 'id',
      },
    },
    severity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    logged_at: {
      type: Sequelize.DATE,
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
    tableName: 'user_symptoms',
    timestamps: false,
    underscored: true,
  }
);

module.exports = { UserSymptoms };
