import slugify from "slugify";
import { Brand } from "../../../DB/models/brand.model.js";
import { Category } from "../../../DB/models/category.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";

export const createBrand = asyncHandler(async (req, res, next) => {
  // check categories
  const { categories } = req.body;
  categories.forEach(async (categoryId) => {
    const category = await Category.findById(categoryId);
    if (!category) {
      return next(new Error(`Category ${category} not found`, { cause: 404 }));
    }
  });
  if (!req.file) return next(new Error("No image provided", { cause: 400 }));
  // upload file on cloudinary
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `${process.env.CLOUD_FOLDER_NAME}/brands` }
  );
  // create brand in database
  const brand = await Brand.create({
    name: req.body.name,
    createdBy: req.user._id,
    slug: slugify(req.body.name),
    image: { url: secure_url, id: public_id },
  });
  // save brand in each category
  categories.forEach(async (categoryId) => {
    const category = await Category.findById(categoryId);
    category.brands.push(brand._id);
    await category.save();
  });
  //response
  res.status(201).json({ message: "Brand created successfully", brand });
});

//update brand
export const updateBrand = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) {
    return next(new Error(`Brand ${brand} not found`, { cause: 404 }));
  }
  if (req.file) {
    // upload file on cloudinary
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      brand.image.id
    );
    brand.image({ url: secure_url, id: public_id });
  }
  brand.name = req.body.name ? req.body.name : brand.name;
  brand.slug = req.body.name ? slugify(req.body.name) : brand.slug;

  // update brand in database
  await brand.save();
  //response
  res.status(200).json({ message: "Brand updated successfully", brand });
});



//delete brand
export const deleteBrand = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findByIdAndDelete(req.params.id);
  if (!brand) {
    return next(new Error(`Brand ${brand} not found`, { cause: 404 }));
  }
  //delete form cloudinary
  await cloudinary.uploader.destroy(brand.image.id);
  // delete brand from each category
await Category.updateMany({},{$pull:{brands:brand._id}})
  //response
  res.status(200).json({ message: "Brand deleted successfully" });
});

export const allBrands=asyncHandler(async(req,res,next)=>{
  const brand=await Brand.find()
  res.status(200).json({message:"all brands",brand})
})
