import Joi from 'joi';

export const getAccountsSchema = Joi.object({
  password: Joi.string().min(8).max(64).pattern(/^\S+$/).required(),
});
export const signupAccountSchema = Joi.object({
  role: Joi.string().valid('user', 'agent', 'admin').required(),
  username: Joi.string().min(4).max(32).pattern(/^\S+$/).required(),
  gender: Joi.string().valid('male', 'female', 'non-binary').required(),
  email: Joi.string().min(4).max(254).email().pattern(/^\S+$/).required(),
  password: Joi.string().min(8).max(64).pattern(/^\S+$/).required(),
  phone: Joi.string()
    .pattern(/^(\+254|0)(1|7)[0-9]{8}$/)
    .required(),
  birth_date: Joi.date()
    .iso()
    .min(new Date(new Date().setFullYear(new Date().getFullYear() - 82)))
    .max(new Date(new Date().setFullYear(new Date().getFullYear() - 18)))
    .required(),
});

export const signinAccountSchema = Joi.object({
  username: Joi.string().min(4).max(32).pattern(/^\S+$/),
  email: Joi.string().min(4).max(254).email().pattern(/^\S+$/),
  password: Joi.string().min(8).max(64).pattern(/^\S+$/).required(),
}).xor('username', 'email');

export const deleteAccountSchema = Joi.object({
  username: Joi.string().min(4).max(32).pattern(/^\S+$/),
  email: Joi.string().email().pattern(/^\S+$/),
  password: Joi.string().pattern(/^\S+$/).required(),
}).xor('username', 'email');
