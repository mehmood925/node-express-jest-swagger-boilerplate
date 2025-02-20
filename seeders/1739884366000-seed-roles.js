'use strict';
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { RoleDal } = require('../src/dal');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      let filePath = './src/data/medcare_ai_roles.json';
      filePath = path.resolve(filePath);
      const rawData = fs.readFileSync(filePath, 'utf8');
      let data = JSON.parse(rawData);
      // console.log({ data });
      for (let role of data) {
        const record = await RoleDal.findOne({
          where: { title: role.title },
          attributes: ['id', 'title'],
          raw: true,
        });
     //   console.log({ record });
        if (!record) {
          await RoleDal.create({
            title: role.title,
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
