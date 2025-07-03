import Joi from './utils/joi.js';
import * as rules from './utils/validators.js';

export const getAccountsSchema = Joi.object({
  password: rules.password,
});
export const signupAccountSchema = Joi.object({
  role: rules.role,
  username: rules.username,
  gender: rules.gender,
  email: rules.email,
  password: rules.password,
  phone: rules.phone,
  birth_date: rules.birth_date,
});

export const signinAccountSchema = Joi.object({
  username: rules.username,
  email: rules.email,
  password: rules.password,
}).xor('username', 'email');

export const deleteAccountSchema = Joi.object({
  username: rules.username,
  email: rules.email,
  password: rules.password,
}).xor('username', 'email');
