import { Router } from "express";
import { getPosts } from "../controller/postController.js";
const router = Router();

router.get("/posts", getPosts);

export default router;
