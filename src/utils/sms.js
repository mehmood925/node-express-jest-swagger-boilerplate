require('dotenv').config();
const AWS = require('aws-sdk');
const secretsManager = new AWS.SecretsManager();
const awsSMSidKey = 'TwilioAccountSID';
const awsSMAuthTokenKey = 'TwilioAuthToken';
const { logger } = require('./logger');
const twilio = require('twilio');

async function getSecretValue() {
  try {
    const _data = await secretsManager
      .getSecretValue({ SecretId: _secretName })
      .promise();
    if ('SecretString' in _data) {
      return JSON.parse(_data.SecretString);
    } else {
      let _buff = Buffer.from(_data.SecretBinary, 'base64');
      return _buff.toString('ascii');
    }
  } catch (_error) {
    logger.info(`=====> ERROR GET SECRET VALUES`);
    logger.info(`Error retrieving secret ${_secretName}:`);
    logger.info(_error.message);
    throw new Error(_error?.message || 'Error in getSecretValue');
  }
}

const _secretName = 'TwilioCredentials';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const _sns = new AWS.SNS();

const sendSnsSms = async (_phoneNumber, _message) => {
  try {
    const _params = {
      Message: _message,
      PhoneNumber: _phoneNumber,
    };
    const _data = await _sns.publish(_params).promise();
    return _data;
  } catch (_error) {
    logger.info(`=====> ERROR SEND SNS SMS`);
    logger.info(`Error sending message to ${_phoneNumber}`);
    logger.info(_error.message);
    throw _error;
  }
};

const sendTwilioSms = async (_phoneNumber, _message) => {
  try {
    const _data = await getSecretValue();

    const _accountSid = _data[awsSMSidKey];
    const _authToken = _data[awsSMAuthTokenKey];
    const _twilioNumber = process.env.TWILIO_PHONE_NUMBER;
    const _client = twilio(_accountSid, _authToken);

    const _message = await _client.messages.create({
      body: _message,
      from: _twilioNumber,
      to: _phoneNumber,
    });
    return _message;
  } catch (_error) {
    logger.info(`=====> ERROR SEND TWILIO SMS`);
    logger.info('Failed to send message');
    logger.info(_error.messge);
  }
};

module.exports = { sendSnsSms, sendTwilioSms };
