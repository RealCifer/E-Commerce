import {
  addProductToWishlist,
  removeProductFromWishlist,
  getUserWishlist,
} from "../services/wishlist.js";

export const addToWishlist = async (req, res) => {
  try {
    const wishlist = await addProductToWishlist(req.user._id, req.params.productId);
    res.json({ message: "Product added to wishlist", wishlist });
  } catch (err) {
    if (err.message === "Product not found") {
      return res.status(404).json({ message: err.message });
    }
    if (err.message === "Product already in wishlist") {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: err.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const wishlist = await removeProductFromWishlist(req.user._id, req.params.productId);
    res.json({ message: "Product removed from wishlist", wishlist });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const wishlist = await getUserWishlist(req.user._id);
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
