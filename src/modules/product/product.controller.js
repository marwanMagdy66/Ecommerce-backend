import { nanoid } from "nanoid";
import { Brand } from "../../../DB/models/brand.model.js";
import { Category } from "../../../DB/models/category.model.js";
import { SubCategory } from "../../../DB/models/subCategory.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";
import { Product } from "../../../DB/models/product.model.js";
import { User } from "../../../DB/models/user.model.js";

export const createProduct = asyncHandler(async (req, res, next) => {
  // Check category, subcategory, and brand
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(404).json({ msg: "Category not found" });

  const subcategory = await SubCategory.findById(req.body.subCategory);
  if (!subcategory)
    return res.status(404).json({ msg: "Subcategory not found" });

  const brand = await Brand.findById(req.body.brand);
  if (!brand) return res.status(404).json({ msg: "Brand not found" });

  // Check if files exist
  if (!req.files) {
    return next(new ErrorResponse("Please upload a file", 400));
  }

  // Log the files structure to verify the input
  console.log("Uploaded Files:", req.files);

  // Create cloud folder
  const cloudFolder = nanoid();
  let images = [];

  // Check if subImages exist and is an array
  const subImages = req.files?.subImages || [];
  if (!Array.isArray(subImages)) {
    return next(new ErrorResponse("SubImages must be an array", 400));
  }

  // Upload sub-images
  for (const file of subImages) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      { folder: `${process.env.CLOUD_FOLDER_NAME}/products/${cloudFolder}` }
    );
    images.push({ url: secure_url, id: public_id });
  }

  // Upload default image
  if (!req.files.defaultImage || !req.files.defaultImage.length) {
    return next(new ErrorResponse("Default image is required", 400));
  }

  const { secure_url: defaultImageUrl, public_id: defaultImageId } =
    await cloudinary.uploader.upload(req.files.defaultImage[0].path, {
      folder: `${process.env.CLOUD_FOLDER_NAME}/products/${cloudFolder}`,
    });

  // Create product
  const product = await Product.create({
    ...req.body,
    cloudFolder,
    createdBy: req.user._id,
    defaultImage: { url: defaultImageUrl, id: defaultImageId },
    images,
  });

  // Send response
  res.status(201).json({
    success: true,
    message: "Product created successfully",
    product,
  });
});

//Delete Product
export const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new Error("Product not found"));
  //check owner
  if (product.createdBy.toString() !== req.user._id.toString())
    return next(new Error("Not authorized to delete this product"));

  //delete product  - from database
  await product.deleteOne();
  //delete images // بمسح هنا الصور نفسها عشان افضي الفولدر
  const ids = product.images.map((image) => image.id);
  ids.push(product.defaultImage.id);
  await cloudinary.api.delete_all_resources(ids);
  //delete folder   // الفولدر لازم يكون فاضي عشان امسحه
  await cloudinary.api.delete_folder(
    `${process.env.CLOUD_FOLDER_NAME}/products/${product.cloudFolder}`
  );
  //return response
  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

// get products

export const getProducts = asyncHandler(async (req, res, next) => {
  //sort , filter, search, pagination >>>query
  //req.query

  ///search
  // const { keyword } = req.query;
  // const results = await Product.find({
  //   name: { $regex: keyword, $options: "i" },   // كده  هيسرش في اي كلمه بتحتوي علي الحروف اللي هبعتها والاوبشن ان الحروف متكونش حساسه كابيتال او سمول
  // });

  //filter
  // const { price,discount,availableItems } = req.query;
  // const results=await Product.find({...req.query})

  //sort
  // const { sort } = req.query;
  // const results = await Product.find().sort( sort);


  const { sort, page, keyword, category, brand, subcategory } = req.query;
  if (category && !(await Category.findById(category)))
    return next(new Error("Category not Found"));
  if (brand && !(await Brand.findById(brand)))
    return next(new Error("Brand not Found"));
  if (subcategory && !(await Subcategory.findById(subcategory)))
    return next(new Error("Subcategory not Found"));

  const results = await Product.find({ ...req.query })
    .sort(sort)
    .pagination(page)
    .search(keyword);
    
  res.json({
    success: true,
    products: results,
  });
});
