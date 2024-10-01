import joi from "joi";
import { isValidObjectId } from "../../middleware/validation.middleware.js";

export const createProduct = joi
  .object({
    name: joi.string().required().min(2).max(20),
    price: joi.number().required().min(1).integer(),
    description: joi.string().min(10).max(200),
    availableItems: joi
      .number()
      .integer()

      .min(1)
      .required(),
    discount: joi.number().min(1).max(100),
    category: joi.string().custom(isValidObjectId),
    subCategory: joi.string().custom(isValidObjectId),
    brand: joi.string().custom(isValidObjectId),
  })
  .required();

export const deleteProduct = joi
  .object({
    id: joi.string().custom(isValidObjectId).required(),
  })
  .required();
