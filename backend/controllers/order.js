import {
  placeOrderFromCart,
  getOrdersByUser,
  getAllOrders,
  updateOrderStatus,
} from "../services/order.js";

export const placeOrderController = async (req, res) => {
  try {
    const order = await placeOrderFromCart(req.user._id);
    res.json({ message: "Order placed successfully", order });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getUserOrdersController = async (req, res) => {
  try {
    const orders = await getOrdersByUser(req.user._id);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await getAllOrders();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateOrderStatusController = async (req, res) => {
  const { status } = req.body;
  try {
    const order = await updateOrderStatus(req.params.id, status);
    res.json({ message: "Order status updated", order });
  } catch (err) {
    if (err.message === "Invalid status value") {
      return res.status(400).json({ message: err.message });
    }
    if (err.message === "Order not found") {
      return res.status(404).json({ message: err.message });
    }
    res.status(500).json({ message: err.message });
  }
};
