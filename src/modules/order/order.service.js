import { Cart } from "../../../DB/models/cart.js";
import { Product } from "../../../DB/models/product.model.js";

export const updateStock = async (products, createOrder) => {
  if (createOrder) {
    for (const prodcut of products) {
      await Product.findByIdAndUpdate(prodcut.productId, {
        $inc: {
          soldItem: prodcut.quantity,
          availableItems: -prodcut.quantity,
        },
      });
      
    }
  }
  else{
    for (const prodcut of products) {
      await Product.findByIdAndUpdate(prodcut.productId, {
        $inc: {
          soldItem: -prodcut.quantity,
          availableItems: prodcut.quantity,
        },
      });
    }
  }
};

export const clearCart = async (userId) => {
  const cart = await Cart.findOneAndUpdate(
    { userId: userId },
    { products: [] }
  );
};
