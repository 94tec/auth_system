
// validators/authValidators.js
const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*\\W).+$'))
    .required()
    .messages({
      'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character',
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('password')) // Reference the 'password' field
    .required()
    .messages({
      'any.only': 'Passwords must match',
    }),
});
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string().min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*\\W).+$'))
    .required()
    .messages({
      'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character',
    }),
  confirmNewPassword: Joi.string()
    .valid(Joi.ref('newPassword')) // Reference the 'password' field
    .required()
    .messages({
      'any.only': 'Passwords must match',
    }),
});

module.exports = {
  registerSchema,
  loginSchema,
  resetPasswordSchema
};

