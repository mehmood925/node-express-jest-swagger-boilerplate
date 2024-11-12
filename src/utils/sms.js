require('dotenv').config();
const AWS = require('aws-sdk');
const secretsManager = new AWS.SecretsManager();
const awsSMSidKey = 'TwilioAccountSID';
const awsSMAuthTokenKey = 'TwilioAuthToken';

const twilio = require('twilio');

async function getSecretValue() {
  try {
    const data = await secretsManager
      .getSecretValue({ SecretId: secretName })
      .promise();
    if ('SecretString' in data) {
      return JSON.parse(data.SecretString);
    } else {
      let buff = Buffer.from(data.SecretBinary, 'base64');
      return buff.toString('ascii');
    }
  } catch (err) {
    console.error(`Error retrieving secret ${secretName}:`, err);
    throw new Error(err?.message || 'Error in getSecretValue');
  }
}

const secretName = 'TwilioCredentials';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const sns = new AWS.SNS();

const sendSnsSms = async (phoneNumber, message) => {
  try {
    const params = {
      Message: message,
      PhoneNumber: phoneNumber,
    };
    const data = await sns.publish(params).promise();
    return data;
  } catch (error) {
    console.error(`Error sending message to ${phoneNumber}: ${error}`);
    throw error;
  }
};

const sendTwilioSms = async (phoneNumber, message) => {
  try {
    const data = await getSecretValue();

    const accountSid = data[awsSMSidKey];
    const authToken = data[awsSMAuthTokenKey];
    const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
    const client = twilio(accountSid, authToken);

    const _message = await client.messages.create({
      body: message,
      from: twilioNumber,
      to: phoneNumber,
    });
    return _message;
  } catch (error) {
    console.error('Failed to send message:', error);
  }
};

module.exports = { sendSnsSms, sendTwilioSms };
