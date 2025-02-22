'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('medication_barcodes', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      medication_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'medications',
          key: 'id',
        },
      },
      barcode: {
        type: Sequelize.STRING(20),
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

    await queryInterface.addIndex('medication_barcodes', ['barcode']);
  },
  async down(queryInterface) {
    await queryInterface.dropTable('medication_barcodes');
  },
};
