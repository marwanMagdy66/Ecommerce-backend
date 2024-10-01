import { Order } from "../../../DB/models/order.model.js";
import { Product } from "../../../DB/models/product.model.js";
import { Review } from "../../../DB/models/review.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const addReview = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { comment, rating } = req.body;
  //check product in order
  const order = await Order.findOne({
    userId: req.user._id,
    status: "delivered",
    "prodcuts.productId": productId,
  });
  if (!order) {
    return next(new Error("Can not review this order", { cause: 400 }));
  }
  // check past reviews
  const pastReview = await Review.findOne({
    createdBy: req.user._id,
    productId,
    orderId: order._id,
  });
  if (pastReview) {
    return next(
      new Error("You have already reviewed this product", { cause: 400 })
    );
  }
  //   create review
  const review = await Review.create({
    comment,
    rating,
    createdBy: req.user._id,
    productId: productId,
    orderId: order._id,
  });
  //calc average rate
  let clacRating = 0;
  const product = await Product.findById(productId);
  const reviews = await Review.find({ productId });
  for (let i = 0; i < reviews.length; i++) {
    clacRating += reviews[i].rating;
  }
  product.averageRating = clacRating / reviews.length;
  await product.save();
  //response
  return res.json({
    success: true,
    message: "your review added successfully",
    review: { review },
  });
});

export const updateReview = asyncHandler(async (req, res, next) => {
  const { id, productId } = req.params;
const review=  await Review.findOneAndUpdate(
    { _id: id, productId: productId },
    { ...req.body },
    { new: true }
  );
  if(req.body.rating){
    let clacRating=0
    const product = await Product.findById(productId);
    const reviews = await Review.find({ productId });
    for (let i = 0; i < reviews.length; i++) {
        clacRating += reviews[i].rating;
      }
      product.averageRating = clacRating / reviews.length;
      await product.save();

  }
  return res.json({ success: true, message: "review updated successfully" ,review});
});
