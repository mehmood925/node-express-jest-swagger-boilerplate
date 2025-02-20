'use strict';
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { MedicationDal, MedicationBarcodeDal } = require('../src/dal');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      let filePath = './src/data/medcare_ai_combined_medications.json';
      filePath = path.resolve(filePath);
      const rawData = fs.readFileSync(filePath, 'utf8');
      let data = JSON.parse(rawData);
      for (let medication of data) {
        let record = await MedicationDal.findOne({
          where: { title: medication.title },
          attributes: ['id', 'title'],
          raw: true,
        });
        let medicationId;
        if (!record) {
          const transaction = await queryInterface.sequelize.transaction(); // Start transaction
          const newMedication = await MedicationDal.create(
            {
              title: medication.title,
              manufacturer: medication.manufacturers,
              strength: medication.strength,
            },
            { transaction }
          );
          medicationId = newMedication.id;

          if (medication.barcode_formats) {
            let barcodeEntries = medication.barcode_formats
              .split(',')
              .map((barcode) => {
                const parts = barcode.trim().split(' ');
                return parts.length > 1 ? parts[1] : null;
              })
              .filter((barcode) => barcode !== null); // Remove any null values
            for (let barcode of barcodeEntries) {
              await MedicationBarcodeDal.create(
                {
                  medication_id: medicationId,
                  barcode: barcode,
                },
                { transaction }
              );
            }
          }
          await transaction.commit(); // Commit transaction if all operations succeed
        }
      }
      console.log('Medications and barcodes seeded successfully!');
    } catch (error) {
      await transaction.rollback(); // Rollback transaction on error
      console.error('Error seeding medications:', error);
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkDelete('medication_barcodes', null, {
        transaction,
      });
      await queryInterface.bulkDelete('medications', null, { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.error('Error rolling back seed data:', error);
    }
  },
};
