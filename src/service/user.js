const bcrypt = require('bcrypt');
const passCom = require('joi-password-complexity');
const { v4: uuidv4 } = require('uuid');
const ERROR_CODES = require('../constant/error-messages');
const CustomError = require('../utils/error');
const { UserDal, UserTokenDal } = require('../dal');
const { EmailService } = require('../utils/email');
const EmailTemplate = require('../utils/emailTemplate');
const CONSTANTS = require('../constant/constant');
const RedisCache = require('../utils/cache');
const { logger } = require('../utils/logger');
const { generateTokens } = require('../middleware/auth');
const { generateRandomCode } = require('../utils/randomNumber');

const _complexityOptions = {
  min: 8,
  max: 26,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
};

class Service {
  static async register(params) {
    const _existingEmail = await UserDal.findOne({
      where: { email: params.email },
    });
    if (_existingEmail) {
      throw new CustomError(ERROR_CODES.USER_ALREADY_EXISTS);
    }
    const _existingUsername = await UserDal.findOne({
      where: { username: params.username },
    });
    if (_existingUsername) {
      throw new CustomError(ERROR_CODES.USERNAME_ALREADY_EXISTS);
    }
    const _existingPhone = await UserDal.findOne({
      where: { phone: params.phone },
    });
    if (_existingPhone) {
      throw new CustomError(ERROR_CODES.PHONE_ALREADY_EXISTS);
    }
    const _pass = passCom(_complexityOptions).validate(params.password);
    if (_pass.error) {
      throw new CustomError(ERROR_CODES.PASS_RULES_ERROR);
    }
    const _verificationCode = generateRandomCode();
    const _verificationExpiry = new Date(
      Date.now() +
        CONSTANTS.EMAIL_CONFIRMATION_CODE_EXPIRY_TIME_IN_SECONDS * 1000
    ).getTime();
    const _user = {
      firstName: params.firstName,
      lastName: params.lastName,
      username: params.username,
      email: params.email,
      password: bcrypt.hashSync(params.password, bcrypt.genSaltSync(2)),
      email_verification_otp: _verificationCode,
      email_verification_otp_expiry: _verificationExpiry,
      email_verified: false,
      role: CONSTANTS.ADMIN,
      phone: params.phone,
    };

    let _userId = await UserDal.create(_user);

    RedisCache.set(CONSTANTS.USER_EMAIL_OTP_ATTEMPTS, _userId, 1);

    Service.sendEmailVerificationCode({
      email: params.email,
      _verificationCode,
    });

    const { accessToken, refreshToken } = generateTokens({
      id: _userId,
      email: _user.email,
      role: _user.role,
    });

    await UserTokenDal.create({
      userId: _userId,
      token: accessToken,
    });

    RedisCache.setWithExpiry(
      CONSTANTS.USER_REFRESH_TOKENS,
      _userId,
      refreshToken,
      CONSTANTS.USER_REFRESH_TOKEN_EXPIRY_IN_SECONDS
    );

    return { accessToken, refreshToken, verificationExpiry, userId: _userId };
  }

  static sendEmailVerificationCode(params) {
    // EmailService.sendEmail({
    //   email: params.email,
    //   subject: CONSTANTS.EMAIL_VERIFICATION_SUBJECT,
    //   html: EmailTemplate.verificationEmailTemplate(params.verificationCode),
    // });
  }

  static async login(params) {
    const _profile = await UserDal.findOne({ where: { email: params.email } });
    if (!_profile) {
      throw new CustomError(ERROR_CODES.INVALID_EMAIL_PASSWORD);
    }

    // if (profile.role !== CONSTANTS.USER) {
    //   throw new CustomError(ERROR_CODES.UNAUTHORISED);
    // }

    await Service.processLoginValidations(params, _profile);

    const { accessToken, refreshToken } = generateTokens({
      id: _profile.id,
      email: _profile.email,
      role: _profile.role,
    });

    await UserTokenDal.create({
      userId: _profile.id,
      token: accessToken,
    });

    RedisCache.setWithExpiry(
      CONSTANTS.USER_REFRESH_TOKENS,
      _profile.id,
      refreshToken,
      CONSTANTS.USER_REFRESH_TOKEN_EXPIRY_IN_SECONDS
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  static async getProfile(params) {
    const _response = await UserDal.findOne({
      where: { id: params.id },
      attributes: { exclude: ['password'] },
    });
    return _response;
  }

  static async processLoginValidations(params, profile) {
    if (!(await bcrypt.compare(params.password, profile.password))) {
      throw new CustomError(ERROR_CODES.INVALID_EMAIL_PASSWORD);
    }
    // if (!profile.emailVerified) {
    //   throw new CustomError(ERROR_CODES.VERIFY_EMAIL);
    // }
    // if (!profile.is_active) {
    //   throw new CustomError(ERROR_CODES.ACCOUNT_DEACTIVATED);
    // }
    // const isBlocked = await RedisCache.get(CONSTANTS.BLOCKED_USERS, profile.id);
    // if (isBlocked) {
    //   throw new CustomError(ERROR_CODES.BLOCK_USER);
    // }
  }

  // static async verifyToken(params) {
  //   const _decodedToken = validatePasswordToken(params.token);
  //   if (!_decodedToken) throw new CustomError(ERROR_CODES.TOKEN_FAILED);
  //   if (_decodedToken === 404) throw new CustomError(ERROR_CODES.TOKEN_FAILED);
  //   const _tokenCheck = await ResetPasswordTokens.findOne({
  //     where: { token: params.token },
  //     raw: true,
  //   });
  //   if (!_tokenCheck) {
  //     throw new CustomError(ERROR_CODES.TOKEN_FAILED);
  //   }
  //   return true;
  // }

  // static async updatePassword(params) {
  //   const _profile = await Admin.findOne({
  //     where: { id: params.loggedUser.id },
  //     raw: true,
  //   });
  //   if (!_profile) {
  //     throw new CustomError(ERROR_CODES.INVALID_PASSWORD);
  //   }
  //   if (!(await bcrypt.compare(params.password, _profile.password))) {
  //     throw new CustomError(ERROR_CODES.INVALID_PASSWORD);
  //   }
  //   if (params.password === params.newPassword) {
  //     throw new CustomError(ERROR_CODES.CANNOT_USE_OLD_PASSWORD);
  //   }
  //   const _pass = passCom(_complexityOptions).validate(params.newPassword); // password validation
  //   if (_pass.error) {
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
  //   const _profile = await Admin.findOne({
  //     where: { email: params.email },
  //     raw: true,
  //   });
  //   if (!_profile) {
  //     return true;
  //   }
  //   const _token = issueResetPassToken({
  //     id: _profile.id,
  //     email: _profile.email,
  //   });
  //   const _tokenCheck = await ResetPasswordTokens.findOne({
  //     where: { email: params.email },
  //     raw: true,
  //   });
  //   if (!_tokenCheck) {
  //     await ResetPasswordTokens.create({
  //       email: params.email,
  //       token: _token,
  //     });
  //   } else {
  //     await ResetPasswordTokens.update(
  //       {
  //         token: _token,
  //       },
  //       {
  //         where: {
  //           id: _tokenCheck.id,
  //         },
  //       }
  //     );
  //   }
  //   const response = await EmailService.sendEmail({
  //     email: params.email,
  //     subject: CONST_VARS.CONSTANTS.FORGET_EMAIL_SUBJECT,
  //     body: CONST_VARS.CONSTANTS.FORGET_EMAIL_BODY+_token,
  //   });
  //   if (response === "ok") return true;
  //   else return response;
  // }

  // static async resetPassword(params) {
  //   const _pass = passCom(_complexityOptions).validate(params.password); // password validation
  //   if (_pass.error) {
  //     throw new CustomError(ERROR_CODES.PASS_RULES_ERROR);
  //   }
  //   const _tokenCheck = await ResetPasswordTokens.findOne({
  //     where: { token: params.token },
  //     raw: true,
  //   });
  //   if (!_tokenCheck) {
  //     throw new CustomError(ERROR_CODES.RESET_PASS_LINK_EXPIRED);
  //   }
  //   // verify the token
  //   const _decodedToken = validatePasswordToken(params.token);
  //   if (_decodedToken === 404)
  //     throw new CustomError(ERROR_CODES.RESET_PASS_LINK_EXPIRED);
  //   const _profile = await Admin.findOne({
  //     where: { email: _decodedToken.email },
  //     raw: true,
  //   });
  //   if (!_profile) {
  //     throw new CustomError(ERROR_CODES.RESET_PASS_LINK_EXPIRED);
  //   }
  //   await ResetPasswordTokens.destroy({
  //     where: {
  //       email: _decodedToken.email,
  //     },
  //   });
  //   await Admin.update(
  //     {
  //       password: bcrypt.hashSync(params.password, bcrypt.genSaltSync(2)),
  //     },
  //     {
  //       where: {
  //         email: _decodedToken.email,
  //       },
  //     }
  //   );
  //   return true;
  // }
}
module.exports = Service;
