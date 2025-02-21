'use strict';
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { RoleDal } = require('../src/dal');
const { logger } = require('../src/utils/logger');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      let filePath = './src/data/medcare_ai_roles.json';
      filePath = path.resolve(filePath);
      const rawData = fs.readFileSync(filePath, 'utf8');
      let data = JSON.parse(rawData);
      for (let role of data) {
        const record = await RoleDal.findOne({
          where: { title: role.title },
          attributes: ['id', 'title'],
          raw: true,
        });
        if (!record) {
          logger.info(`Inserting role seeder ${role.title}`);
          await RoleDal.create({
            title: role.title,
          });
        }
      }
      logger.info('Roles seeder executed successfully!');
    } catch (error) {
      console.log(error);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  },
};
