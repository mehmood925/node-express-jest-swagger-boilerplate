'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_lab_values', {
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
      lab_value_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'lab_values',
          key: 'id',
        },
      },
      reading: {
        type: Sequelize.STRING(255),
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

    await queryInterface.addIndex('user_lab_values', ['user_id']);
    await queryInterface.addIndex('user_lab_values', ['lab_value_id']);
  },
  async down(queryInterface) {
    await queryInterface.dropTable('user_lab_values');
  },
};
