'use strict';
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { SymptomDal } = require('../src/dal');
const { logger } = require('../src/utils/logger');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      let filePath = './src/data/medcare_ai_symptoms.json';
      filePath = path.resolve(filePath);
      const rawData = fs.readFileSync(filePath, 'utf8');
      let data = JSON.parse(rawData);
      for (let symptom of data) {
        const record = await SymptomDal.findOne({
          where: { title: symptom.title },
          attributes: ['id', 'title'],
          raw: true,
        });
        if (!record) {
          logger.info(`Inserting symptom seeder ${symptom.title}`);
          await SymptomDal.create({
            title: symptom.title,
          });
        }
      }
      logger.info('Symptoms seeder executed successfully!');
    } catch (error) {
      console.log(error);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  },
};
