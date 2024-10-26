const nodemailer = require('nodemailer');
require('dotenv').config();
const { logger } = require('./logger');

class EmailService {
  static async sendEmail(params) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      const mailOptions = {
        to: params.email,
        from: process.env.SENDER_EMAIL,
        subject: params.subject,
      };

      if (params.html) {
        mailOptions.html = params.html;
      } else {
        mailOptions.text = params.body;
      }

      await transporter.sendMail(mailOptions);
      return 'ok';
    } catch (error) {
      logger.error('Error in Email Service')
      logger.error(error.message)
      return error;
    }
  }
}
module.exports = { EmailService };
