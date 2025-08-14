import Order from "../models/order.js";
import Cart from "../models/cart.js";

export const placeOrderFromCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  const total = cart.items.reduce((sum, item) => {
    return sum + (item.product.price * item.quantity);
  }, 0);

  const order = await Order.create({
    user: userId,
    products: cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
    })),
    total,
  });

  cart.items = [];
  await cart.save();

  return order;
};

export const getOrdersByUser = async (userId) => {
  return await Order.find({ user: userId }).populate("products.product");
};

export const getAllOrders = async () => {
  return await Order.find()
    .populate("user", "name email")
    .populate("products.product", "name price");
};

export const updateOrderStatus = async (orderId, status) => {
  const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
  if (!validStatuses.includes(status)) {
    throw new Error("Invalid status value");
  }

  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error("Order not found");
  }

  order.status = status;
  await order.save();
  return order;
};
