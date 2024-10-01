
import { model, Schema, Types } from "mongoose";

const copounSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
    min: 1,
    max: 100,
  },
  expiredAt: {
    type: Number,
    required: true,
  },
  createdBy: {
    type: Types.ObjectId,
    ref: "User",
    required:true
  },
},
{
    timestamps:true
});
export const Coupon=model('Copoun',copounSchema)