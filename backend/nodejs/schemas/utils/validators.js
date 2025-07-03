import Joi from './joi.js';

// accounts
export const role = Joi.string().valid('user', 'agent', 'admin').required();
export const username = Joi.string().min(4).max(32).pattern(/^\S+$/).required();
export const gender = Joi.string().valid('male', 'female', 'non-binary').required();
export const email = Joi.string().max(254).email().pattern(/^\S+$/).required();
export const password = Joi.string().min(8).max(32).pattern(/^\S+$/).required();
export const phone = Joi.string()
  .pattern(/^\+[1-9]\d{7,14}$/)
  .required();
export const birth_date = Joi.date()
  .iso()
  .min(new Date(new Date().setFullYear(new Date().getFullYear() - 82)))
  .max(new Date(new Date().setFullYear(new Date().getFullYear() - 18)))
  .required();

//   properties
export const title = Joi.string().min(4).max(64);
export const description = Joi.string().min(32).max(1024);
export const address = Joi.string().min(8).max(256);
export const price = Joi.number().min(0).precision(2);
export const bedrooms = Joi.number().min(0).max(20);
export const bathrooms = Joi.number().min(0).max(20);
export const area = Joi.number().min(1);
export const latitude = Joi.number().min(-90).max(90);
export const longitude = Joi.number().min(-180).max(180);
export const images = Joi.array().items(Joi.string().uri()).min(1);
export const property_types = Joi.string().valid(
  'apartment',
  'condo',
  'duplex',
  'family-home',
  'villa',
  'bungalow',
  'mansion',
  'studio',
  'townhouse',
  'land',
  'shop',
  'warehouse',
  'office',
  'retail-space',
  'farm',
  'industrial'
);

export const listing_purpose = Joi.string().valid('for-sale', 'for-rent', 'lease', 'short-let');
