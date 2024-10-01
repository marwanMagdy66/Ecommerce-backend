import { Cart } from "../../../DB/models/cart.js";
import { Product } from "../../../DB/models/product.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const addToCart = asyncHandler(async (req, res, next) => {
  //add product in products array in the cart
  const { productId, quantity } = req.body;
  //check product
  const product = await Product.findById(productId);
  if (!product) {
    return next(new Error("Product not found", { cause: 404 }));
  }

  //check stock
  if (!product.inStock(quantity)) {
    return next(
      new Error(`sorry, only ${product.availableItems}  items are availabel`)
    );
  }
  //check product in cart or not
  const isProductInCart = await Cart.findOne({
    userId: req.user._id,
    "products.productId": productId,
  });
  if (isProductInCart) {
    const theProduct = isProductInCart.products.find(
      (prd) => prd.productId.toString() === productId.toString()
    );
    if (product.inStock(theProduct.quantity + quantity)) {
      theProduct.quantity += quantity;
      await isProductInCart.save();
      return res.json({ message: "product added to cart" });
    } else {
      return next(
        new Error(`sorry, only ${product.availableItems}  items are availabel`)
      );
    }
  }
  const cart = await Cart.findOneAndUpdate(
    {
      userId: req.user._id,
    },
    {
      $push: { products: { productId, quantity } },
    },
    { new: true }
  );
  return res.json({
    success: true,
    message: "your product added to cart successfully",
    results: cart,
  });
});

//get user cart

export const getUserCart = asyncHandler(async (req, res, next) => {
  if (req.user.role == "user") {
    const cart = await Cart.findOne({ userId: req.user._id });
    return res.json({
      success: true,
      cart: cart,
    });
  }
  if (req.user.role == "admin" && !req.body.cartId) {
    return next(new Error("cart id is required !"));
  }
  const cart = await Cart.findById(req.body.cartId);
  return res.json({
    success: true,
    cart: cart,
  });
});

//update cart

export const updateCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;

  //check product
  const product = await Product.findById(productId);
  if (!product) {
    return next(new Error("Product not found", { cause: 404 }));
  }
  //check stock
  if (!product.inStock(quantity)) {
    return next(
      new Error(`sorry, only ${product.availableItems}  items are availabel`)
    );
  }
  // update Cart
  const cart = await Cart.findOneAndUpdate(
    {
      userId: req.user._id,
      "products.productId": productId,
    },
    {
      "products.$.quantity": quantity, //>>>> هنا الدولار ساين تشير للبروداكت اللي انا عاوز اغير في الكميه بتاعته
    },
    { new: true }
  );
  return res.json({
    success: true,
    message: "your product updated successfully",
    results: { cart },
  });
});

//remove form cart
export const removeFromCart = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;
  const product = await Product.findById(productId);
  if (!product) {
    return next(new Error("Product not found", { cause: 404 }));
  }
  const cart = await Cart.findOneAndUpdate(
    {
      userId: req.user._id,
    },
    {
      $pull: { products: { productId } },
    },
    { new: true }
  );
  return res.json({
    success: true,
    message: "your product deleted successfully",
    results: { cart },
  });
});

// clear cart
export const clearCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { userId: req.user._id },
    {
      products: [],
    },
    { new: true }
  );
  return res.json({
    success: true,
    message: "your products deleted successfully",
    results: { cart },
  });
});
