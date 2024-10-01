import joi from "joi";
import { isValidObjectId } from "../../middleware/validation.middleware.js";

export const createSubcategory=joi.object({
    name:joi.string().required().min(5).max(20).required(),
    category:joi.string().custom(isValidObjectId).required()

}).required()


export const updateSubcategory=joi.object({
    name:joi.string().required().min(5).max(20),
    id:joi.string().required().custom(isValidObjectId),
    category:joi.string().custom(isValidObjectId).required()


}).required()



export const deleteSubcategory=joi.object({
    category:joi.string().custom(isValidObjectId).required(),
    id:joi.string().required().custom(isValidObjectId),


}).required()

export const allSubcategory=joi.object({
    category:joi.string().custom(isValidObjectId)


}).required()
