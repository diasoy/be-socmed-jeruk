import Post from "../models/Post.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

const getUserIdFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, jwtSecret);
    return decoded.userId;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

export const toggleLikePost = async (req, res) => {
  const { token, postId } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  let userId;
  try {
    userId = getUserIdFromToken(token);
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
      await post.save();
      return res
        .status(200)
        .json({ message: "Post unliked successfully", post });
    } else {
      post.likes.push(userId);
      await post.save();
      return res.status(201).json({ message: "Post liked successfully", post });
    }
  } catch (error) {
    console.error("Error toggling like on post:", error);
    res
      .status(500)
      .json({ error: "An error occurred while toggling like on post" });
  }
};
