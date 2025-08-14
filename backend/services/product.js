import Product from "../models/product.js";

export const createProduct = async (productData) => {
  const product = new Product(productData);
  return await product.save();
};

export const getAllProducts = async () => {
  return await Product.find();
};

export const getProductById = async (id) => {
  return await Product.findById(id);
};

export const updateProductById = async (id, updateData) => {
  return await Product.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteProductById = async (id) => {
  return await Product.findByIdAndDelete(id);
};
