import { Router } from "express";
import {
  createPost,
  detailPost,
  getPostsByToken,
} from "../controller/postController.js";
const router = Router();

router.post("/posts", getPostsByToken); 
router.post("/post", createPost);
router.post("/post/:postId", detailPost); 

export default router;
