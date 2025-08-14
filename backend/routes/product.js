import express from "express";
import {
  createProductController,
  getAllProductsController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
} from "../controllers/product.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, admin, createProductController);
router.get("/", getAllProductsController);
router.get("/:id", getProductByIdController);
router.put("/:id", protect, admin, updateProductController);
router.delete("/:id", protect, admin, deleteProductController);

export default router;
