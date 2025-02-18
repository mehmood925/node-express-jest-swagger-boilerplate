const _cron = require('node-cron');
// const CustomError = require('../utils/error');
// const ERROR_CODES = require('../constant/error-messages');
const { logger } = require('../utils/logger');

class CronClass {
  static async cronJob() {
    cron.schedule('*/30 * * * *', async () => {
      try {
        logger.info('CRON JOB STARTED');
        logger.info('CRON JOB COMPLETED');
      } catch (error) {
        logger.info(`=====> ERROR CRON`);
        logger.error(error.message);
      }
    });
  }
}

module.exports = { CronClass };
