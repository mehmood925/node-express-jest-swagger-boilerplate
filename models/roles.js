const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/utils/database');
// const { encrypt, decrypt, hash } = require('../src/utils/encryption');
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
      // set(value) {
      //   this.setDataValue('title', encrypt(value));
      // },
      // get() {
      //   const rawValue = this.getDataValue('title');
      //   return rawValue ? decrypt(rawValue) : null;
      // },
    },
    // title_hash: {
    //   type: DataTypes.STRING(64),
    //   allowNull: false,
    // },
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
