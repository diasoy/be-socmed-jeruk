import { Router } from "express";
import { likePost, unlikePost } from "../controller/likeController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/like", verifyToken, likePost);
router.post("/unlike", verifyToken, unlikePost);

export default router;
