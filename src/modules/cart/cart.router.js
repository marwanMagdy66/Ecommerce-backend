import { Router } from "express";
import { isAuthentication } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import * as cartController from "./cart.controller.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as cartSchema from "./cart.schema.js";

const router = Router();

//add to cart
router.post(
  "/add",
  isAuthentication,
  isAuthorized("user"),
  validation(cartSchema.addToCart),
  cartController.addToCart
);

//get user cart
router.get(
  "/userCart",
  isAuthentication,
  isAuthorized("user","admin"),
  validation(cartSchema.getUserCart),
  cartController.getUserCart
);
// update cart
router.patch(
  "/update-Cart",
  isAuthentication,
  isAuthorized("user"),
  validation(cartSchema.updateCart),
  cartController.updateCart
);
///////////////////////
//remove product form cart
router.patch(
  "/remove-From-Cart",
  isAuthentication,
  isAuthorized("user"),
  validation(cartSchema.removeFromCart),
  cartController.removeFromCart
);
//  clear cart
router.put(
  "/clear-cart",
  isAuthentication,
  isAuthorized("user"),
  cartController.clearCart
);
export default router;
