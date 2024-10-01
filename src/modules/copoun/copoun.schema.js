import joi from "joi";

export const createCoupon = joi
  .object({
    discount: joi.number().integer().required().min(1).max(100),
    expiredAt: joi.date().required().greater(Date.now()),
  })
  .required();

export const updateCoupon = joi
  .object({
    code: joi.string().required().length(5),
    discount: joi.number().integer().min(1).max(100),
    expiredAt: joi.date().greater(Date.now()),
  })
  .required();

export const deleteCoupon = joi
  .object({
    code: joi.string().required().length(5),
  })
  .required();
