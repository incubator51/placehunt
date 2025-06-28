import Joi from 'joi';

export const signupAccountSchema = Joi.object({
  username: Joi.string().min(4).max(32).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(32).required(),
  created: Joi.date().iso().max('now').required(),
  last_seen: Joi.date().iso().max('now').required(),
  phone: Joi.string()
    .pattern(/^(\+254|0)(1|7)[0-9]{8}$/)
    .required(),
  birth_date: Joi.date()
    .iso()
    .min(new Date(new Date().setFullYear(new Date().getFullYear() - 82)))
    .max(new Date(new Date().setFullYear(new Date().getFullYear() - 18)))
    .required(),
});

export const loginAccountSchema = Joi.object({
  username: Joi.string().min(4).max(32),
  email: Joi.string().email(),
  password: Joi.string().required(),
  last_seen: Joi.date().iso().max('now').required(),
}).xor('username', 'email');

export const deleteAccountSchema = Joi.object({
  username: Joi.string().min(4).max(32),
  email: Joi.string().email(),
  password: Joi.string().required(),
}).xor('username', 'email');
