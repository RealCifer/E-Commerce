import express from "express";
import {
  placeOrderController,
  getUserOrdersController,
  getAllOrdersController,
  updateOrderStatusController,
} from "../controllers/order.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.post("/from-cart", protect, placeOrderController);
router.get("/", protect, getUserOrdersController);
router.get("/all", protect, admin, getAllOrdersController);
router.put("/:id/status", protect, admin, updateOrderStatusController);

export default router;
