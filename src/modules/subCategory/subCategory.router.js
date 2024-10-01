import { Router } from "express";
import { isAuthentication } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { fileUpload } from "../../utils/fileUpload.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as subcategorySchema from "./subCategory.schema.js";
import * as subcategoryController from "./subCategory.controller.js";

const router = Router({ mergeParams: true });

//CRUD

//Create subcategory
router.post(
  "/create/:category",
  isAuthentication,
  isAuthorized("admin"),
  fileUpload().single("subcategory"),
  validation(subcategorySchema.createSubcategory),
  subcategoryController.createSubcategory
);

//Update subcategory
router.patch(
  "/update/:category/:id",
  isAuthentication,
  isAuthorized("admin"),
  fileUpload().single("subcategory"),
  validation(subcategorySchema.updateSubcategory),
  subcategoryController.updateSubcategory
);

//Delete category
router.delete(
  "/delete/:category/:id",
  isAuthentication,
  isAuthorized("admin"),
  validation(subcategorySchema.deleteSubcategory),
  subcategoryController.deleteSubcategory
);

router.get(
  "/",
  validation(subcategorySchema.allSubcategory),
  subcategoryController.allSubcategories
);
export default router;
