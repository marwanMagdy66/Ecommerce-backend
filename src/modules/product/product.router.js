import { Router } from "express";
import * as productSchema from "./product.schema.js";
import * as productContoller from "./product.controller.js";
import { isAuthentication } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { fileUpload } from "../../utils/fileUpload.js";
import { validation } from "../../middleware/validation.middleware.js";
import reviewRouter from "../review/review.router.js";
const router = Router();

router.use("/:productId/review", reviewRouter);
//CRUD

//Create product
router.post(
  "/create",
  isAuthentication,
  isAuthorized("saller"),
  fileUpload().fields([
    { name: "defaultImage", maxCount: 1 }, // Array for default image
    { name: "subImages", maxCount: 10 },
  ]),
  validation(productSchema.createProduct),
  productContoller.createProduct
);

//Delete product
router.delete(
  "/delete/:id",
  isAuthentication,
  isAuthorized("saller"),
  validation(productSchema.deleteProduct),
  productContoller.deleteProduct
);

// get products
router.get("/", productContoller.getProducts);
export default router;
