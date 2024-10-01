import joi from 'joi';
import { isValidObjectId } from '../../middleware/validation.middleware.js';

export const createCategory=joi.object({
    name:joi.string().required().min(5).max(20).required()

}).required()



export const updateCategory=joi.object({
    name:joi.string().required().min(5).max(20),
    id:joi.string().required().custom(isValidObjectId)

}).required()


export const deleteCategory=joi.object({
    id:joi.string().required().custom(isValidObjectId)

}).required()

