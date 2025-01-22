import { Router } from "express";
import { likePost, unlikePost } from "../controller/likeController.js";

const router = Router();

router.post("/like", likePost);
router.post("/unlike", unlikePost);

export default router;
