import { Router } from "express";
import { addComment, deleteComment } from "../controller/commentController.js";

const router = Router();

router.post("/addComment", addComment);
router.post("/deleteComment", deleteComment);

export default router;
