import { Router } from "express";
import { toggleLikePost } from "../controller/likeController.js";

const router = Router();

router.post("/like", toggleLikePost);

export default router;
