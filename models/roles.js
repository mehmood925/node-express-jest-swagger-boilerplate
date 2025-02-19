const crypto = require('crypto');
const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/utils/database');
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-32-char-secret-key'; // 32 characters
const IV_LENGTH = 16;

function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  console.log("im here")
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(text) {
  const [iv, encryptedText] = text.split(':');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

const Sequelize = DataTypes;
const Roles = sequelize.define(
  'roles',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: Sequelize.STRING(255),
      allowNull: false,
      set(value) {
        this.setDataValue('title', encrypt(value));
      },
      get() {
        const rawValue = this.getDataValue('title');
        return rawValue ? decrypt(rawValue) : null;
      }
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false,
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false,
    },
  },
  {
    tableName: 'roles',
    timestamps: false,
    underscored: true,
  }
);

module.exports = { Roles };
