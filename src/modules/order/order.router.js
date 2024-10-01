import { Router } from "express";
import * as orderController from "./order.controller.js";
import * as orderSchema from "./order.schema.js";
import { isAuthentication } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
const router = Router();

//create order
router.post(
  "/create",
  isAuthentication,
  isAuthorized("user"),
  validation(orderSchema.createOrder),
  orderController.createOrder
);

//cancel order
router.patch(
  "/cancel/:id",
  isAuthentication,
  isAuthorized("user"),
  validation(orderSchema.cancelOrder),
  orderController.cancelOrder
);
export default router;
