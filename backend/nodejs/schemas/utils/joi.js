import JoiBase from 'joi';
import {parsePhoneNumberFromString} from 'libphonenumber-js';

export const Joi = JoiBase.extend((joi) => ({
  type: 'phone',
  base: joi.string(),
  messages: {'phone.invalid': '{{#label}} must be a valid phone number'},
  validate(value, helpers) {
    const phoneNumber = parsePhoneNumberFromString(value);
    if (!phoneNumber || !phoneNumber.isValid()) return {value, errors: helpers.error('phone.invalid')};
    return {value: phoneNumber.number};
  },
}));
