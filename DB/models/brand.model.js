import { Schema, Types,model } from "mongoose";

export const brandSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, min: 2, max: 12 },
    slug: { type: String, required: true, unique: true },
    image: { url: { type: String, required: true } ,id:{type: String, required: true}},
    createdBy:{type:Types.ObjectId,ref:"User"}

},
  { timestamps: true }
);

export const Brand=model("Brand",brandSchema)