import {
  findCartByUser,
  addItemToCart,
  removeItemFromCart,
  updateItemQuantity,
} from "../services/cart.js";

export const addToCart = async (req, res) => {
  const { productId, quantity, size, color } = req.body;
  try {
    const cart = await addItemToCart(req.user._id, productId, quantity, size, color);
    res.json(cart);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await findCartByUser(req.user._id);
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const cart = await removeItemFromCart(req.user._id, req.params.productId);
    res.json(cart);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const cart = await updateItemQuantity(req.user._id, productId, quantity);
    res.json(cart);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
