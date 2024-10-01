import { model, Schema, Types } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true, min: 2, max: 20 },
    price: { type: Number, required: true, min: 1 },
    description: { type: String, min: 10, max: 200 },
    images: [
      {
        id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    defaultImage: {
      id: { type: String, required: true },
      url: { type: String, required: true },
    },
    availableItems: { type: Number, min: 1, required: true },
    soldItem: { type: Number, default: 0 },
    discount: { type: Number, min: 1, max: 100 },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    category: { type: Types.ObjectId, ref: "Category", required: true },
    subCategory: { type: Types.ObjectId, ref: "SubCategory", required: true },
    brand: { type: Types.ObjectId, ref: "Brand", required: true },
    cloudFolder: { type: String, unique: true, required: true },
    averageRating: { type: Number, min: 1, max: 5 },
  },
  {
    timestamps: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//virtual
//to show reviews for every product
productSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "productId",
});
//to calculate final price
productSchema.virtual("finalPrice").get(function () {
  return Number.parseFloat(
    this.price - (this.price * this.discount || 0) / 100
  ).toFixed(2);
});

//query helpers
productSchema.query.pagination = function (page) {
  page = page < 1 || isNaN(page) || !page ? 1 : page;
  const limit = 1;
  const skip = limit * (page - 1);
  return this.skip(skip).limit(limit);
};

productSchema.query.search = function (keyword) {
  if (keyword)
    return this.find({
      name: { $regex: keyword, $options: "i" },
    });
};

// methods
productSchema.methods.inStock = function (requiredQuantity) {
  //this >> document >> product
  return this.availableItems >= requiredQuantity ? true : false;
};

export const Product = model("Product", productSchema);
