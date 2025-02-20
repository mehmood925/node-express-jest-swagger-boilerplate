const bcrypt = require('bcrypt');
const passCom = require('joi-password-complexity');
const { v4: uuidv4 } = require('uuid');
const ERROR_CODES = require('../constant/error-messages');
const CustomError = require('../utils/error');
//const { Users, Roles } = require('../../models');
const { EmailService } = require('../utils/email');
const EmailTemplate = require('../utils/emailTemplate');
const CONSTANTS = require('../constant/constant');
const RedisCache = require('../utils/cache');
const { logger } = require('../utils/logger');
const { generateTokens } = require('../middleware/auth');
const { generateRandomCode } = require('../utils/randomNumber');
const { RoleDal } = require('../dal');
// require('dotenv').config();
// const fs = require('fs');
// const axios = require('axios');
// const path = require('path');


const complexityOptions = {
  min: 8,
  max: 26,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
};
const API_URL = 'https://api.barcodelookup.com/v3/products';
const API_KEY = 'rfm02p610h1nciuts1sohp494oyntz';
let counter = 0;
class UserService {
  static async fetchBarcodeData(title, length, i) {
    const queryParams = ['search', 'title', 'brand'];

    for (let param of queryParams) {
      try {
        const response = await axios.get(API_URL, {
          params: {
            key: API_KEY,
            formatted: 'y',
            [param]: title,
          },
        });

        if (response.status === 200 && response.data.products.length > 0) {
          counter += 1;
          console.log('Found ', counter, ' of ', length, ' iteration ', i + 1);
          const product = response.data.products[0]; // Take the first product
          return {
            barcode_number: product.barcode_number || null,
            barcode_formats: product.barcode_formats || null,
          };
        }
      } catch (error) {
        //console.log("Not Found at ", param , " iteration ", i+1)
      }
    }

    return { barcode_number: null, barcode_formats: null };
  }
  static updateKeyName(data, oldKey, newKey) {
    return data.map((obj) => {
      if (obj.hasOwnProperty(oldKey)) {
        return { [newKey]: obj[oldKey] };
      }
      return obj; // Return unchanged object if key is not found
    });
  }

  static async updateJsonFile(jsonFilePath) {
    try {
      const filePath = path.resolve(jsonFilePath);
      const rawData = fs.readFileSync(filePath, 'utf8');
      let data = JSON.parse(rawData);
      const updatedData = this.updateKeys(data);
      //const newFilePath = '/Users/tk-lpt-0958/Downloads/work/node-express-jest-swagger-boilerplate/src/data/medcare_ai_combined_medications.json'
      fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 4));
      console.log('JSON file updated successfully!');
    } catch (error) {
      console.error('Error processing JSON file:', error.message);
    }
  }

  static removeQuotesFromStrength(data) {
    return data.map((obj) => {
      if (Array.isArray(obj.strength)) {
        obj.strength = obj.strength.map((str) => str.replace(/"/g, '')); // Remove all double quotes
      }
      return obj;
    });
  }
  static mergeByTitleAndStrength(data) {
    const groupedData = {};

    data.forEach((obj) => {
      const key = `${obj.title}`;

      if (!groupedData[key]) {
        groupedData[key] = {
          title: obj.title,
          strength: [obj.strength],
          manufacturers: obj.manufacturer,
          barcode_number: obj.barcode_number,
          barcode_formats: obj.barcode_formats,
        };
      } else {
        groupedData[key].strength.push(obj.strength);
      }
    });

    return Object.values(groupedData);
  }
  static removeNullStrengths(data) {
    return data.map((obj) => {
      if (Array.isArray(obj.strength)) {
        obj.strength = obj.strength.filter((item) => item !== null);
      }
      return obj;
    });
  }
  static sliceTitleAfterMg(data) {
    return data.map((obj) => {
      const mgRegex = /(\d+\s*mg)/i; // Matches "number + mg" (e.g., "400 mg")
      const match = obj.title.match(mgRegex);

      if (match) {
        const mgIndex = match.index + match[0].length; // Find position after "mg"
        obj.title = obj.title.slice(0, mgIndex).trim(); // Slice the title
      }

      return obj;
    });
  }
  static updateKeys(data) {
    const keyMap = {
      'Lab Test': 'title',
      Unit: 'unit',
      Description: 'description',
    };

    return data.map((obj) => {
      let updatedObj = {};
      for (let key in obj) {
        updatedObj[keyMap[key] || key] = obj[key]; // Rename keys if found in keyMap, otherwise keep original key
      }
      return updatedObj;
    });
  }

  static async register(params) {
    
    //await this.updateJsonFile(['./src/data/medcare_ai_au.json', './src/data/medcare_ai_eu.json', './src/data/medcare_ai_it.json', './src/data/medcare_ai_usa.json']);
    return true;
    // const rsole = await RoleDal.findOne({
    //   where: { title_hash: hash('admin') },
    //   attributes: ['id', 'title', 'title_hash'],
    //   raw: false,
    // });

    // const rsole = await RoleDal.create({
    //   title: 'admin',
    //   title_hash: hash('admin')
    // });
    // console.log({ rsole });
    return rsole;
    // const existingEmail = await Users.findOne({
    //   where: { email: params.email },
    //   attributes: ['id', 'email', 'phone', 'username'],
    //   raw: true,
    // });
    // if (existingEmail) {
    //   throw new CustomError(ERROR_CODES.USER_ALREADY_EXISTS);
    // }
    // const existingUsername = await Users.findOne({
    //   where: { username: params.username },
    //   attributes: ['id', 'email', 'phone', 'username'],
    //   raw: true,
    // });
    // if (existingUsername) {
    //   throw new CustomError(ERROR_CODES.USERNAME_ALREADY_EXISTS);
    // }
    // const existingPhone = await Users.findOne({
    //   where: { phone: params.phone },
    //   attributes: ['id', 'email', 'phone', 'username'],
    //   raw: true,
    // });
    // if (existingPhone) {
    //   throw new CustomError(ERROR_CODES.PHONE_ALREADY_EXISTS);
    // }
    // const pass = passCom(complexityOptions).validate(_params.password);
    // if (pass.error) {
    //   throw new CustomError(ERROR_CODES.PASS_RULES_ERROR);
    // }
    // const verificationCode = generateRandomCode();
    // console.log({ verificationCode });
    // const verificationExpiry = new Date(
    //   Date.now() +
    //     CONSTANTS.EMAIL_CONFIRMATION_CODE_EXPIRY_TIME_IN_SECONDS * 1000
    // ).getTime();
    // const role = await Roles.findOne({
    //   where: { role: CONSTANTS.USER },
    //   attributes: ['id'],
    // });
    // const user = {
    //   firstName: params.firstName,
    //   lastName: params.lastName,
    //   username: params.username,
    //   email: params.email,
    //   password: bcrypt.hashSync(params.password, bcrypt.genSaltSync(10)),
    //   emailVerificationOTP: verificationCode,
    //   emailVerificationOTPExpiry: verificationExpiry,
    //   emailVerified: false,
    //   roleId: role.id,
    //   phone: params.phone,
    //   timezone: params.timezone,
    // };

    // let userId = await Users.create(user);

    // RedisCache.set(CONSTANTS.USER_EMAIL_OTP_ATTEMPTS, userId, 1);

    // Service.sendEmailVerificationCode({
    //   email: params.email,
    //   verificationCode: verificationCode,
    // });

    // const { accessToken, refreshToken } = generateTokens({
    //   id: userId,
    //   email: user.email,
    //   role: user.role,
    // });

    // await UserTokens.create({
    //   userId: userId,
    //   token: accessToken,
    // });

    // RedisCache.setWithExpiry(
    //   CONSTANTS.USER_REFRESH_TOKENS,
    //   userId,
    //   refreshToken,
    //   CONSTANTS.USER_REFRESH_TOKEN_EXPIRY_IN_SECONDS
    // );

    // return { accessToken, refreshToken, verificationExpiry, userId: userId };
  }

  static sendEmailVerificationCode(params) {
    // EmailService.sendEmail({
    //   email: params.email,
    //   subject: CONSTANTS.EMAIL_VERIFICATION_SUBJECT,
    //   html: EmailTemplate.verificationEmailTemplate(params.verificationCode),
    // });
  }

  static async login(params) {
    //   const profile = await UserDal.findOne({ where: { email: params.email } });
    //   if (!profile) {
    //     throw new CustomError(ERROR_CODES.INVALID_EMAIL_PASSWORD);
    //   }
    //   if (profile.role !== CONSTANTS.USER) {
    //     throw new CustomError(ERROR_CODES.UNAUTHORISED);
    //   }
    //   await UserService.processLoginValidations(params, profile);
    //   const { accessToken, refreshToken } = generateTokens({
    //     id: profile.id,
    //     email: profile.email,
    //     role: profile.role,
    //   });
    //   await UserTokens.create({
    //     userId: profile.id,
    //     token: accessToken,
    //   });
    //   RedisCache.setWithExpiry(
    //     CONSTANTS.USER_REFRESH_TOKENS,
    //     profile.id,
    //     refreshToken,
    //     CONSTANTS.USER_REFRESH_TOKEN_EXPIRY_IN_SECONDS
    //   );
    //   return {
    //     accessToken,
    //     refreshToken,
    //   };
    // }
    // static async getProfile(params) {
    //   const response = await UserDal.findOne({
    //     where: { id: params.id },
    //     attributes: { exclude: ['password'] },
    //   });
    //   return response;
    // }
    // static async processLoginValidations(params, profile) {
    //   if (!(await bcrypt.compare(params.password, profile.password))) {
    //     throw new CustomError(ERROR_CODES.INVALID_EMAIL_PASSWORD);
    //   }
    //   if (!profile.emailVerified) {
    //     throw new CustomError(ERROR_CODES.VERIFY_EMAIL);
    //   }
    //   if (!profile.is_active) {
    //     throw new CustomError(ERROR_CODES.ACCOUNT_DEACTIVATED);
    //   }
    //   const isBlocked = await RedisCache.get(CONSTANTS.BLOCKED_USERS, profile.id);
    //   if (isBlocked) {
    //     throw new CustomError(ERROR_CODES.BLOCK_USER);
    //   }
    // }
    // static async verifyToken(params) {
    //   const decodedToken = validatePasswordToken(params.token);
    //   if (!decodedToken) throw new CustomError(ERROR_CODES.TOKEN_FAILED);
    //   if (decodedToken === 404) throw new CustomError(ERROR_CODES.TOKEN_FAILED);
    //   const tokenCheck = await ResetPasswordTokens.findOne({
    //     where: { token: params.token },
    //     raw: true,
    //   });
    //   if (!tokenCheck) {
    //     throw new CustomError(ERROR_CODES.TOKEN_FAILED);
    //   }
    //   return true;
    // }
    // static async updatePassword(params) {
    //   const profile = await Admin.findOne({
    //     where: { id: params.loggedUser.id },
    //     raw: true,
    //   });
    //   if (!profile) {
    //     throw new CustomError(ERROR_CODES.INVALID_PASSWORD);
    //   }
    //   if (!(await bcrypt.compare(params.password, profile.password))) {
    //     throw new CustomError(ERROR_CODES.INVALID_PASSWORD);
    //   }
    //   if (params.password === params.newPassword) {
    //     throw new CustomError(ERROR_CODES.CANNOT_USE_OLD_PASSWORD);
    //   }
    //   const pass = passCom(_complexityOptions).validate(params.newPassword); // password validation
    //   if (pass.error) {
    //     throw new CustomError(ERROR_CODES.PASS_RULES_ERROR);
    //   }
    //   await Admin.update(
    //     {
    //       password: bcrypt.hashSync(params.newPassword, bcrypt.genSaltSync(2)),
    //     },
    //     {
    //       where: {
    //         id: params.loggedUser.id,
    //       },
    //     }
    //   );
    //   return true;
    // }
    // static async forgetPassword(params) {
    //   const profile = await Admin.findOne({
    //     where: { email: params.email },
    //     raw: true,
    //   });
    //   if (!profile) {
    //     return true;
    //   }
    //   const token = issueResetPassToken({
    //     id: profile.id,
    //     email: profile.email,
    //   });
    //   const tokenCheck = await ResetPasswordTokens.findOne({
    //     where: { email: params.email },
    //     raw: true,
    //   });
    //   if (!tokenCheck) {
    //     await ResetPasswordTokens.create({
    //       email: params.email,
    //       token,
    //     });
    //   } else {
    //     await ResetPasswordTokens.update(
    //       {
    //         token: token,
    //       },
    //       {
    //         where: {
    //           id: tokenCheck.id,
    //         },
    //       }
    //     );
    //   }
    //   const response = await EmailService.sendEmail({
    //     email: params.email,
    //     subject: CONST_VARS.CONSTANTS.FORGET_EMAIL_SUBJECT,
    //     body: CONST_VARS.CONSTANTS.FORGET_EMAIL_BODY+token,
    //   });
    //   if (response === "ok") return true;
    //   else return response;
    // }
    // static async resetPassword(params) {
    //   const pass = passCom(complexityOptions).validate(params.password); // password validation
    //   if (pass.error) {
    //     throw new CustomError(ERROR_CODES.PASS_RULES_ERROR);
    //   }
    //   const tokenCheck = await ResetPasswordTokens.findOne({
    //     where: { token: params.token },
    //     raw: true,
    //   });
    //   if (!tokenCheck) {
    //     throw new CustomError(ERROR_CODES.RESET_PASS_LINK_EXPIRED);
    //   }
    //   // verify the token
    //   const decodedToken = validatePasswordToken(params.token);
    //   if (decodedToken === 404)
    //     throw new CustomError(ERROR_CODES.RESET_PASS_LINK_EXPIRED);
    //   const profile = await Admin.findOne({
    //     where: { email: decodedToken.email },
    //     raw: true,
    //   });
    //   if (!profile) {
    //     throw new CustomError(ERROR_CODES.RESET_PASS_LINK_EXPIRED);
    //   }
    //   await ResetPasswordTokens.destroy({
    //     where: {
    //       email: decodedToken.email,
    //     },
    //   });
    //   await Users.update(
    //     {
    //       password: bcrypt.hashSync(params.password, bcrypt.genSaltSync(2)),
    //     },
    //     {
    //       where: {
    //         email: decodedToken.email,
    //       },
    //     }
    //   );
    //   return true;
  }
}
module.exports = { UserService };
