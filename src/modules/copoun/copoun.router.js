import { Router } from "express";
import { isAuthentication } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { fileUpload } from "../../utils/fileUpload.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as couponController from "./copoun.controller.js";
import * as copounSchema from "./copoun.schema.js";

const router = Router();

router.post(
  "/create",
  isAuthentication,
  isAuthorized("saller"),
  validation(copounSchema.createCoupon),
  couponController.createCoupon
);

router.patch(
  "/update/:code",
  isAuthentication,
  isAuthorized("saller"),
  validation(copounSchema.updateCoupon),
  couponController.updateCoupon
);

router.delete(
  "/delete/:code",
  isAuthentication,
  isAuthorized("saller"),
  validation(copounSchema.deleteCoupon),
  couponController.deleteCoupon
);

router.get(
  "/all",
  isAuthentication,
  isAuthorized("saller",'admin'),
  couponController.allCoupons
);

export default router;
