'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_healthcare_providers', {
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
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('pharmacy', 'hospital', 'clinic', 'other'),
        allowNull: false,
      },
      address: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      lat: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      long: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      contact_info: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      rating: {
        type: Sequelize.DOUBLE,
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

    await queryInterface.addIndex('user_healthcare_providers', ['user_id']);
  },
  async down(queryInterface) {
    await queryInterface.dropTable('user_healthcare_providers');
  },
};
