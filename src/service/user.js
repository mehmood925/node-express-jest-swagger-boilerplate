require('dotenv').config();
const bcrypt = require('bcrypt');
const passCom = require('joi-password-complexity');
const { v4: uuidv4 } = require('uuid');
const ERROR_CODES = require('../constant/error-messages');
const CustomError = require('../utils/error');
const { EmailService } = require('../utils/email');
const EmailTemplate = require('../utils/emailTemplate');
const CONSTANTS = require('../constant/constant');
const RedisCache = require('../utils/cache');
const { logger } = require('../utils/logger');
const { generateTokens } = require('../middleware/auth');
const { generateRandomCode } = require('../utils/randomNumber');
const { RoleDal } = require('../dal');
const fs = require('fs');
const axios = require('axios');
const path = require('path');
const supabase = require('../utils/supabaseClient');

const complexityOptions = {
  min: 8,
  max: 26,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
};

class UserService {
  static async signup(params) {
    console.log({ params });
    const { email, password } = params;

    const { data, error } = await supabase.auth.signUp({ email, password });
    console.log({ data });
    if (error) console.log({ error });
    return params;
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

  static async signupSocial(params) {
    // console.log({ params });
    // const { provider } = params; // e.g., "google", "github"

    // const { data, error } = await supabase.auth.signInWithOAuth({
    //   provider, // Supported providers: "google", "github", "facebook", etc.
    //   options: { redirectTo: 'http://localhost:3000/auth/callback' },
    // });

    // if (error) return res.status(400).json({ error: error.message });
    // return data.url;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/api/v1/user/callback', // Change this to your frontend callback URL
      },
    });

    if (error) throw error;
    return { auth_url: data.url };
  }

  static async signinSocial(params) {
    const { access_token } = params;

    if (!access_token) {
      return { error: 'Access token is required' };
    }

    // Verify the token and get user details
    const { data: user, error } = await supabase.auth.getUser(access_token);

    if (error) throw error;
    return { user };
  }

  static sendEmailVerificationCode(params) {
    // EmailService.sendEmail({
    //   email: params.email,
    //   subject: CONSTANTS.EMAIL_VERIFICATION_SUBJECT,
    //   html: EmailTemplate.verificationEmailTemplate(params.verificationCode),
    // });
  }

  static async login(params) {
    const { email, password } = params;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { error: error.message };

    return { message: 'Login successful!', data };
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
