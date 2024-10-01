import slugify from "slugify";
import { Category } from "../../../DB/models/category.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";

export const createCategory = asyncHandler(async (req, res, next) => {
  //name slug  createdBy image
  const { name } = req.body;
  const userId = req.user._id;
  //check file
  if (!req.file)
    return next(new Error("Category image is required !", { cause: 400 }));
  //upload image in cloudinary
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.CLOUD_FOLDER_NAME}/category`,
    }
  );
  //create category
  await Category.create({
    name,
    slug: slugify(name),
    createdBy: userId,
    image: { id: public_id, url: secure_url },
  });
  return res.json({
    success: true,
    message: "your category added successfully ",
  });
});

export const updateCategory = asyncHandler(async (req, res, next) => {
  //check category is exist or not
  const { id: categoryID } = req.params;
  const category = await Category.findById(categoryID);
  if (!category) return next(new Error("Category not found !", { cause: 404 }));
  //check category owner
  if (req.user._id.toString() !== category.createdBy.toString())
    return next(
      new Error("You are not allowed to update this category !", { cause: 400 })
    );

  //check if he want to upload file
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      {
        public_id: category.image.id,
      }
    );
    category.image = { id: public_id, url: secure_url };
  }
  //update category
  category.name = req.body.name ? req.body.name : category.name;
  category.slug = req.body.slug ? slugify(req.body.name) : category.slug;

  await category.save();

  return res.json({
    success: true,
    message: "your category updated successfully ",
  });
});

export const deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) return next(new Error("Category not found !", { cause: 404 }));
  //check category owner
  if (req.user._id.toString() !== category.createdBy.toString())
    return next(
      new Error("You are not allowed to delete this category !", { cause: 400 })
    );
  await category.deleteOne();
  await cloudinary.uploader.destroy(category.image.id);
  return res.json({
    success: true,
    message: "your category deleted successfully ",
  });
});

export const AllCategoies = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().populate("subcategory");

  return res.json({
    success: true,
    categories: categories,
  });
});
