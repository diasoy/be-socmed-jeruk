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

export const addComment = async (req, res) => {
  const { token, postId, comment, userId, username, email } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  if (!comment || !userId || !username || !email) {
    return res
      .status(400)
      .json({ error: "Comment and user information are required" });
  }

  let commenterId;
  try {
    commenterId = getUserIdFromToken(token);
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }

  if (commenterId !== userId) {
    return res.status(401).json({ error: "Invalid user ID" });
  }

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (!post.comments) {
      post.comments = [];
    }

    const newComment = {
      comment,
      userId,
      username,
      email,
      createdAt: new Date(),
    };

    post.comments.push(newComment);
    await post.save();

    res.status(201).json({ message: "Comment added successfully", post });
  } catch (error) {
    console.error("Error adding comment:", error);
    res
      .status(500)
      .json({
        error: "An error occurred while adding comment",
        details: error.message,
      });
  }
};

export const deleteComment = async (req, res) => {
  const { token, postId, commentId } = req.body;

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

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.userId.toString() !== userId) {
      return res
        .status(401)
        .json({ error: "You are not authorized to delete this comment" });
    }

    comment.remove();
    await post.save();

    res.status(200).json({ message: "Comment deleted successfully", post });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res
      .status(500)
      .json({
        error: "An error occurred while deleting comment",
        details: error.message,
      });
  }
};
