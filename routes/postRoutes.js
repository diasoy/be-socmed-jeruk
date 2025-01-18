import { Router } from "express";
import { getPosts, createPost } from "../controller/postController.js";
const router = Router();

router.get("/posts", getPosts);
router.post("/post", createPost);

export default router;
