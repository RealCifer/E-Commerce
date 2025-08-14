import User from "../models/user.js";
import Product from "../models/product.js";

export const addProductToWishlist = async (userId, productId) => {
  const user = await User.findById(userId);
  const product = await Product.findById(productId);

  if (!product) throw new Error("Product not found");
  if (user.wishlist.includes(product._id)) throw new Error("Product already in wishlist");

  user.wishlist.push(product._id);
  await user.save();
  return user.wishlist;
};

export const removeProductFromWishlist = async (userId, productId) => {
  const user = await User.findById(userId);
  user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
  await user.save();
  return user.wishlist;
};

export const getUserWishlist = async (userId) => {
  const user = await User.findById(userId).populate("wishlist");
  return user.wishlist;
};
