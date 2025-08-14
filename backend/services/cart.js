import Cart from "../models/cart.js";
import Product from "../models/product.js";

export const findCartByUser = async (userId) => {
  return await Cart.findOne({ user: userId }).populate("items.product");
};

export const addItemToCart = async (userId, productId, quantity, size, color) => {
  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [{ product: productId, quantity, size, color }]
    });
  } else {
    const itemIndex = cart.items.findIndex(
      i => i.product.toString() === productId && i.size === size && i.color === color
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity, size, color });
    }
    await cart.save();
  }
  return cart.populate("items.product");
};

export const removeItemFromCart = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new Error("Cart not found");

  cart.items = cart.items.filter(i => i.product.toString() !== productId);
  await cart.save();
  return cart.populate("items.product");
};

export const updateItemQuantity = async (userId, productId, quantity) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new Error("Cart not found");

  const item = cart.items.find(i => i.product.toString() === productId);
  if (item) {
    item.quantity = quantity;
    await cart.save();
  }
  return cart.populate("items.product");
};
