import Joi from './utils/joi.js';
import * as rules from './utils/validators';

export const postPropertySchema = Joi.object({
  title: rules.title.required(),
  description: rules.description.required(),
  price: rules.price.required(),
  type: rules.property_types.required(),
  area: rules.area.required(),
  bedrooms: rules.bedrooms.optional(),
  bathrooms: rules.bathrooms.optional(),
  images: rules.imageArray.required(),
  location: Joi.object({
    address: rules.address.required(),
    coordinates: Joi.object({
      latitude: rules.latitude.optional(),
      longitude: rules.longitude.optional(),
    }).optional(),
  }).required(),
  purpose: rules.listing_purpose.required(),
});
