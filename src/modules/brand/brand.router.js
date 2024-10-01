import { Router } from "express";
import { isAuthentication } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { fileUpload } from "../../utils/fileUpload.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as brandController from "./brand.controller.js";
import * as brandSchema from "./brand.schema.js";

const router = Router();

// CRUD

//Create brand
router.post(
  "/create",
  isAuthentication,
  isAuthorized("admin"),
  fileUpload().single("brand"),
  validation(brandSchema.createBrand),
  brandController.createBrand
);

//Update brand
router.patch(
  "/update/:id",
  isAuthentication,
  isAuthorized("admin"),
  fileUpload().single("brand"),
  validation(brandSchema.updateBrand),
  brandController.updateBrand
);

//Delete brand
router.delete(
  "/delete/:id",
  isAuthentication,
  isAuthorized("admin"),
  validation(brandSchema.deleteBrand),
  brandController.deleteBrand
);

// all brands
router.get("/",brandController.allBrands)
export default router;
