import { Router } from "express";
import { getAllUsers } from "../controllers/userController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = Router();

router.get("/", protect, adminOnly, getAllUsers);

export default router;
