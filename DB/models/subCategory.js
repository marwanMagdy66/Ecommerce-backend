import { model, Schema, Types } from "mongoose";

const subCategorySchema = new Schema(
  {
    name: { type: String, unique: true, required: true, min: 5, max: 20 },
    slug: { type: String, required: true, unique: true },
    createdBy: { type: Types.ObjectId, ref: "User" ,required:true},
    image: { id: { type: String }, url: { type: String } },
    category: { type: Types.ObjectId, ref: "Category" ,required:true},
    brands:[{type:Types.ObjectId,ref:"Brand"}]


  },
  {
    timestamps: true,
  }
);

export const SubCategory=model("SubCategory",subCategorySchema);
