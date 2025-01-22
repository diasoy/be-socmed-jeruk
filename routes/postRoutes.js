import { Router } from "express";
import { createPost, getPostsByToken } from "../controller/postController.js";
const router = Router();

router.post("/posts", getPostsByToken);
router.post("/post", createPost);

export default router;
