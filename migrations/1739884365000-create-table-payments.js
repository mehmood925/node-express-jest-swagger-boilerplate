'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payments', {
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
      subscription_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'subscriptions',
          key: 'id',
        },
      },
      amount: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      currency: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      payment_method: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      transaction_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      apple_transaction_id: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      google_order_id: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('initiated', 'success'),
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

    await queryInterface.addIndex('payments', ['user_id']);
    await queryInterface.addIndex('payments', ['subscription_id']);
  },
  async down(queryInterface) {
    await queryInterface.dropTable('payments');
  },
};
