import { model, Schema, Types } from "mongoose";

const orderSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    prodcuts: [
      {
        productId: { type: Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, min: 1 },
        itemPrice: { type: Number },
        name: { type: String },
        totalPrice: { type: Number },
      },
    ],
    address: { type: String, required: true },
    payment: { type: String, default: "cash", enum: ["cash", "visa"] },
    phone: { type: String, requried: true },
    price: { type: Number, required: true },
    invoice: { url: String, id: String },
    coupon: {
      id: { type: Types.ObjectId, ref: "Coupon" },
      name: String,
      discount: { type: Number, min: 1, max: 100 },
    },
    status: {
      type: String,
      default: "placed",
      enum: ["placed", "shipped", "delivered", "canceled", "refunded"],
    },
  },
  { timestamps: true }
);
orderSchema.virtual("finalPrice").get(function () {
    return this.coupon?
     Number.parseFloat(
      this.price - (this.price * this.coupon.discount ) / 100
    ).toFixed(2): this.price
  });
  
export const Order=model("Order",orderSchema)