'use strict';
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { LabValueDal } = require('../src/dal');
const { logger } = require('../src/utils/logger');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      let filePath = './src/data/medcare_ai_labvalues.json';
      filePath = path.resolve(filePath);
      const rawData = fs.readFileSync(filePath, 'utf8');
      let data = JSON.parse(rawData);
      for (let labValue of data) {
        const record = await LabValueDal.findOne({
          where: { title: labValue.title },
          attributes: ['id', 'title'],
          raw: true,
        });
        if (!record) {
          logger.info(`Inserting lab value seeder ${labValue.title}`);
          await LabValueDal.create({
            title: labValue.title,
            unit: labValue.unit,
            description: labValue.description,
          });
        }
      }
      logger.info('Lab values seeder executed successfully!');
    } catch (error) {
      console.log(error);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  },
};
