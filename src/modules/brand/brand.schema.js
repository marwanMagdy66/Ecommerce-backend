import joi from "joi";
import { isValidObjectId } from "../../middleware/validation.middleware.js";

export const createBrand = joi
  .object({
    name: joi.string().min(2).max(25).required(),
    categories: joi
      .array()
      .items(joi.string().custom(isValidObjectId))
      .required(),
  })
  .required();

export const updateBrand = joi
  .object({
    id: joi.string().custom(isValidObjectId).required(),
    name: joi.string().min(2).max(25),
  })
  .required();

export const deleteBrand = joi
  .object({
    id: joi.string().custom(isValidObjectId).required(),
  })
  .required();
