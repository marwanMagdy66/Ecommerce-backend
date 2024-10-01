import { Router } from "express";
import * as categoryController from "./category.controller.js";
import { isAuthentication } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { fileUpload } from "../../utils/fileUpload.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as categorySchema from "./category.schema.js";
import subcategoryRouter from "../subCategory/subCategory.router.js";

const router = Router();

//عشان يكون الصب كاتيجوري تحت الكاتيجوري 
router.use("/:category/subcategory",subcategoryRouter)


// CRUD

//Create category
router.post(
  "/create",
  isAuthentication,
  isAuthorized("admin"),
  fileUpload().single("category"),
  validation(categorySchema.createCategory),
  categoryController.createCategory
);

//Update category
router.patch(
  "/update/:id",
  isAuthentication,
  isAuthorized("admin"),
  fileUpload().single("category"),
  validation(categorySchema.updateCategory),
  categoryController.updateCategory
);

//Delete category
router.delete(
  "/delete/:id",
  isAuthentication,
  isAuthorized("admin"),
  validation(categorySchema.deleteCategory),
  categoryController.deleteCategory
);

//all category
router.get("/", categoryController.AllCategoies);

export default router;
