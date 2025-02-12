'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = [
      {
        role: 'user',
        createdAt: '2023-02-18 18:52:00.000000',
        updatedAt: '2023-02-18 18:52:00.000000',
      },
      {
        role: 'admin',
        createdAt: '2023-02-18 18:52:00.000000',
        updatedAt: '2023-02-18 18:52:00.000000',
      },
    ];
    try {
      const _roles = await queryInterface.sequelize.query(
        'SELECT * FROM "roles"', { type: queryInterface.sequelize.QueryTypes.SELECT });
      if(_roles.length === 0) {
        await queryInterface.bulkInsert('roles', data, {});
      } 
    } catch (error) {
      console.log(error);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  },
};
