'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('lab_values', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      unit: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      min_safe_value: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      max_safe_value: {
        type: Sequelize.INTEGER,
        allowNull: true,
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

    await queryInterface.addIndex('lab_values', ['title']);
  },
  async down(queryInterface) {
    await queryInterface.dropTable('lab_values');
  },
};
