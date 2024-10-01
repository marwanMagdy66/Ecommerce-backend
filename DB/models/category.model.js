import { model, Schema, Types } from "mongoose";
import { SubCategory } from "./subCategory.js";

const categorySchema = new Schema(
  {
    name: { type: String, unique: true, required: true, min: 5, max: 20 },
    slug: { type: String, required: true, unique: true },
    createdBy: { type: Types.ObjectId, ref: "User" ,required:true},
    image: { id: { type: String }, url: { type: String } },
    brands:[{type:Types.ObjectId,ref:"Brand"}]
  },
  {
    timestamps: true,toJSON:{virtuals:true},toObject:{virtuals:true}
  }
);

// deleteOne() >> document(category).deleteOne()
categorySchema.post("deleteOne",{document:true,query:false},async function () {
  await SubCategory.deleteMany({
    category:this._id
  })
})


//virtual subcategory field  i use that to save spaces in database    
// now i can access subcategory using populite ('subcategory')

categorySchema.virtual("subcategory",{
  ref:"SubCategory",
  localField:"_id", // primariy key in category schema
  foreignField:"category" // forign key in subcategory >> category field will be the forign key 
})
export const Category=model("Category",categorySchema);
