import voucher_codes from "voucher-code-generator";
import { Coupon } from "../../../DB/models/coupon.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const createCoupon = asyncHandler(async (req, res, next) => {
  //generate code for coupon
  const code = voucher_codes.generate({ length: 5 });
  //create coupon
  const copoun = await Coupon.create({
    name: code[0],
    discount: req.body.discount,
    createdBy: req.user._id,
    expiredAt: new Date(req.body.expiredAt).getTime(),
  });
  //response
  res
    .status(201)
    .json({ message: "Coupon created successfully", data: copoun });
});

export const updateCoupon = asyncHandler(async (req, res, next) => {
  //find coupon
  const coupon = await Coupon.findOne({
    name: req.params.code,
    expiredAt: { $gt: Date.now() },
  });
  //check if coupon exists
  if (!coupon) {
    return next(new Error("Coupon not found"));
  }
  //check owner
  if (coupon.createdBy.toString() !== req.user._id) {

    return next(new Error("you are not allowed to update that coupon",{cause:404}));
  
  }
  //update coupon
  coupon.discount = req.body.discount ? req.body.discount : coupon.discount;
  coupon.expiredAt = req.body.expiredAt
    ? new Date(req.body.expiredAt).getTime()
    : coupon.expiredAt;

  await coupon.save();
  //response
  res
    .status(201)
    .json({ message: "Coupon updated  successfully" });
});


export const deleteCoupon = asyncHandler(async (req, res, next) => {
//find coupon
const coupon = await Coupon.findOne({
  name: req.params.code,
});
//check if coupon exists
if (!coupon) {
  return next(new Error("Coupon not found"));
}
//check owner
if (coupon.createdBy.toString() !== req.user._id.toString()) {

  return next(new Error("you are not allowed to delete that coupon",{cause:404}));

}
await coupon.deleteOne();
  //response
  res
    .status(201)
    .json({ message: "Coupon deleted successfully" });
});


export const allCoupons=asyncHandler(async(req,res,next)=>{
  if(req.user.role=='admin'){
    const coupons=await Coupon.find();
    res
    .status(201)
    .json({ message: "all coupons ",coupons });
  }
  else if(req.user.role=='saller'){
    const coupons=await Coupon.find({createdBy:req.user._id})
    res
    .status(201)
    .json({ message: "all coupons ",coupons });
    }


 


})