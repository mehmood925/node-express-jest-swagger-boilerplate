const _nodemailer = require('nodemailer');
require('dotenv').config();
const { logger } = require('./logger');

class EmailService {
  static async sendEmail(_params) {
    try {
      const _transporter = _nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
      });
      const _mailOptions = {
        to: _params.email,
        from: process.env.SENDER_EMAIL,
        subject: _params.subject,
      };

      if (_params.html) {
        _mailOptions.html = _params.html;
      } else {
        _mailOptions.text = _params.body;
      }

      await _transporter.sendMail(_mailOptions);
      return true;
    } catch (_error) {
      logger.info(`=====> ERROR EMAIL SERVICE`);
      logger.error(_error.message);
      return _error;
    }
  }
}
module.exports = { EmailService };
