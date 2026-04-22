import { Router } from "express";
import { body } from "express-validator";
import { getComments, addComment, deleteComment } from "../controllers/commentController.js";
import validate from "../middleware/validate.js";

const router = Router({ mergeParams: true });

router
  .route("/")
  .get(getComments)
  .post(
    [body("content").notEmpty().withMessage("Content is required")],
    validate,
    addComment
  );

router.delete("/:id", deleteComment);

export default router;
