import slugify from "slugify";
import { Category } from "../../../DB/models/category.model.js";
import { SubCategory } from "../../../DB/models/subCategory.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";

export const createSubcategory = asyncHandler(async (req, res, next) => {
  // check category
  const category = await Category.findById(req.params.category);
  if (!category) return res.status(404).json({ message: "Category not found" });
  //name slug  createdBy image
  const { name } = req.body;
  const userId = req.user._id;
  //check file
  if (!req.file)
    return next(new Error("Subcategory image is required !", { cause: 400 }));
  //upload image in cloudinary
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.CLOUD_FOLDER_NAME}/Subcategory`,
    }
  );
  //create Subcategory
  await SubCategory.create({
    name,
    slug: slugify(name),
    createdBy: userId,
    image: { id: public_id, url: secure_url },
    category: req.params.category,
  });
  return res.json({
    success: true,
    message: "your Subcategory added successfully ",
  });
});

export const updateSubcategory = asyncHandler(async (req, res, next) => {
  //check category is exist or not
  const category = await Category.findById(req.params.category);
  if (!category) return next(new Error("Category not found !", { cause: 404 }));
  //check subcategory is exist or not
  const subcategory = await SubCategory.findById({
    _id: req.params.id,
    category: req.params.category,
  });
  if (!subcategory)
    return next(new Error("Subcategory not found !", { cause: 404 }));
  //check category owner
  if (req.user._id.toString() !== subcategory.createdBy.toString())
    return next(
      new Error("You are not allowed to update this subcategory !", {
        cause: 400,
      })
    );

  //check if he want to upload file
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      {
        public_id: subcategory.image.id,
      }
    );
    subcategory.image = { id: public_id, url: secure_url };
  }
  //update category
  subcategory.name = req.body.name ? req.body.name : subcategory.name;
  subcategory.slug = req.body.name ? slugify(req.body.name) : subcategory.slug;

  await subcategory.save();

  return res.json({
    success: true,
    message: "your subcategory updated successfully ",
  });
});

export const  deleteSubcategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.category);
  if (!category) return next(new Error("Category not found !", { cause: 404 }));

  const subcategory = await SubCategory.findById(req.params.id);
  if (!subcategory)
    return next(new Error("Subcategory not found !", { cause: 404 }));
  //check category owner
  if (req.user._id.toString() !== subcategory.createdBy.toString())
    return next(
      new Error("You are not allowed to delete this subcategory !", {
        cause: 400,
      })
    );
  await subcategory.deleteOne();
  await cloudinary.uploader.destroy(subcategory.image.id);
  return res.json({
    success: true,
    message: "your subcategory deleted successfully ",
  });
});

export const allSubcategories = asyncHandler(async (req, res, next) => {
  //   const category = await Category.findById(req.params.category);
  //   if (!category) return next(new Error("Category not found !", { cause: 404 }));

  const category = req.params.category;
  if (!category) {
    //multiaple populite 
    //nested populite
    const subcategories = await SubCategory.find().populate([{path:'category',populate:[{path:'createdBy',select:'email'}]},{path:'createdBy',select:'userName'}]);
    return res.json({
      success: true,
      subcategories: subcategories,
    });
  } else {
    const subcategories = await SubCategory.find({
      category: req.params.category,
    }).populate('createdBy');
    return res.json({
      success: true,
      subcategories: subcategories,
    });
  }
});
