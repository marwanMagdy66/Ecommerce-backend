import joi from 'joi';
import { isValidObjectId } from '../../middleware/validation.middleware.js';

export const addReview=joi.object({
    productId:joi.string().custom(isValidObjectId).required(),
    rating:joi.number().required().min(1).max(5),
    comment:joi.string().required(),


}).required()


export const updateReview=joi.object({
    productId:joi.string().custom(isValidObjectId).required(),
    rating:joi.number().min(1).max(5),
    comment:joi.string(),
    id:joi.string().custom(isValidObjectId).required(),


}).required()