const Joi = require('joi');
const { safeString } = require('./customValidation');

module.exports.register = Joi.object({
  email: Joi.string()
    .max(324)
    .trim()
    .regex(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)
    .required(),
  password: safeString
    .string()
    .htmlStrip()
    .trim()
    .min(1)
    .max(100)
    .required(),
  phone: Joi.string()
    .pattern(/^\+([1-9]{1}[0-9]{0,2})\d{6,14}$/)
    .messages({
      'string.pattern.base':
        'Phone number must be in international format, starting with + and followed by the country code and subscriber number.',
    })
    .required(),
});

module.exports.login = Joi.object({
  email: Joi.string()
    .max(324)
    .trim()
    .regex(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)
    .required(),
  password: safeString
    .string()
    .htmlStrip()
    .trim()
    .min(1)
    .max(100)
    .required(),
});

module.exports.updatePassword = Joi.object({
  password: safeString
    .string()
    .htmlStrip()
    .trim()
    .min(1)
    .max(100)
    .required(),
  newPassword: safeString
  .string()
  .htmlStrip()
  .trim()
  .min(1)
  .max(100)
  .required(),
});

module.exports.forgetPassword = Joi.object({
  email: Joi.string()
    .max(324)
    .trim()
    .regex(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)
    .required(),
});

module.exports.verifyForgetPasswordCode = Joi.object({
  email: Joi.string()
    .max(324)
    .trim()
    .regex(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)
    .required(),
  code: Joi.string().max(4).required(),
});

module.exports.resetPassword = Joi.object({
  password: safeString
    .string()
    .htmlStrip()
    .withoutEquals()
    .trim()
    .min(8)
    .max(16)
    .required(),
  email: Joi.string()
    .max(324)
    .trim()
    .regex(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)
    .required(),
});