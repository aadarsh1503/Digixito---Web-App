import { Router } from "express";
import { body } from "express-validator";
import {
  getTasks, getTask, createTask, updateTask, deleteTask,
  getAllTasks, createTaskForUser, adminDeleteTask, adminUpdateTask,
} from "../controllers/taskController.js";
import { protect, adminOnly } from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import commentRoutes from "./commentRoutes.js";

const router = Router();

router.use(protect);

const taskValidation = [
  body("title").notEmpty().withMessage("Title is required"),
  body("status").optional().isIn(["todo", "in-progress", "done"]),
  body("priority").optional().isIn(["low", "medium", "high"]),
  body("dueDate").optional().isISO8601().withMessage("Invalid date format"),
];

// Admin routes — must be before /:id to avoid param conflicts
router.get("/admin/all", adminOnly, getAllTasks);
router.post("/admin/create-for-user", adminOnly, taskValidation, validate, createTaskForUser);
router.put("/admin/:id", adminOnly, taskValidation, validate, adminUpdateTask);
router.delete("/admin/:id", adminOnly, adminDeleteTask);

// User task routes
router.route("/").get(getTasks).post(taskValidation, validate, createTask);

// Comments nested route — before /:id
router.use("/:taskId/comments", commentRoutes);

// Dynamic param route — must be last
router.route("/:id").get(getTask).put(taskValidation, validate, updateTask).delete(deleteTask);

export default router;
