'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_medication_schedules', {
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
      scheduled_time: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      days_of_week: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
    });

    await queryInterface.addIndex('user_medication_schedules', ['user_id']);
    await queryInterface.addIndex('user_medication_schedules', ['medication_id']);
  },
  async down(queryInterface) {
    await queryInterface.dropTable('user_medication_schedules');
  },
};
