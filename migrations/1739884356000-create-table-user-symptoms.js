'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_symptoms', {
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
      symptom_id: {
        type: Sequelize.UUID,
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
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
    });

    await queryInterface.addIndex('user_symptoms', ['user_id']);
    await queryInterface.addIndex('user_symptoms', ['symptom_id']);
  },
  async down(queryInterface) {
    await queryInterface.dropTable('user_symptoms');
  },
};
