import express from "express";
import {
  signupUser,
  loginUser,
  getUsers,
  deleteUser,
} from "../controllers/user.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.get("/all", protect, admin, getUsers);
router.delete("/:id", protect, admin, deleteUser);

export default router;
