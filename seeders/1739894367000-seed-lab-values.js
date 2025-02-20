'use strict';
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { LabValueDal } = require('../src/dal');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      let filePath = './src/data/medcare_ai_labvalues.json';
      filePath = path.resolve(filePath);
      const rawData = fs.readFileSync(filePath, 'utf8');
      let data = JSON.parse(rawData);
      // console.log({ data });
      for (let labValue of data) {
        const record = await LabValueDal.findOne({
          where: { title: labValue.title },
          attributes: ['id', 'title'],
          raw: true,
        });
     //   console.log({ record });
        if (!record) {
          await LabValueDal.create({
            title: labValue.title,
            unit: labValue.unit,
            description: labValue.description,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  },
};
