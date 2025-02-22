const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/utils/database');
const Sequelize = DataTypes;
const UserMedications = sequelize.define(
  'user_medications',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    medication_id: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'medications',
        key: 'id',
      },
    },
    purpose: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    notes: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    refill_reminder: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    reminder_threshold: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    notifications_enabled: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    form_of_drug: {
      type: Sequelize.ENUM(
        'Ampoule(s)',
        'Application(s)',
        'Capsule(s)',
        'Drop(s)',
        'Gram(s)',
        'Injection(s)',
        'Mililiter(s)',
        'Pill(s)'
      ),
      allowNull: false,
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    frequency: {
      type: Sequelize.ENUM(
        'Once a day',
        'Two times a day',
        'Three times a day',
        'Every X hours',
        'Every other day',
        'Specific days of the week',
        'Every X days',
        'Every X weeks',
        'Every X months'
      ),
      allowNull: false,
    },
    requirements: {
      type: Sequelize.ENUM(
        'Take with food',
        'Before eating',
        'After eating',
        'Does not matter'
      ),
      allowNull: false,
    },
    dose_required: {
      type: Sequelize.STRING(255),
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
    tableName: 'user_medications',
    timestamps: false,
    underscored: true,
  }
);

module.exports = { UserMedications };
