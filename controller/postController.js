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

export const getPostsByToken = async (req, res) => {
  const { token } = req.body;
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    const totalPosts = await Post.countDocuments();
    const posts = await Post.find()
      .populate("author")
      .skip((page - 1) * perPage)
      .limit(perPage);

    const formattedPosts = posts.map((post) => ({
      _id: post._id,
      content: post.content,
      author: post.author
        ? {
            id: post.author._id,
            name: post.author.name,
            email: post.author.email,
          }
        : null,
      likes: post.likes,
      comments: post.comments,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }));

    res.json({
      totalPosts,
      totalPages: Math.ceil(totalPosts / perPage),
      currentPage: page,
      perPage,
      posts: formattedPosts,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "An error occurred while fetching posts" });
  }
};

export const createPost = async (req, res) => {
  const { content, token, author_id, author_name, author_email } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Content is required" });
  }

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  if (!author_id || !author_name || !author_email) {
    return res.status(400).json({ error: "Author information is required" });
  }

  try {
    const newPost = new Post({
      content,
      author: {
        _id: author_id,
        name: author_name,
        email: author_email,
      },
      likes: [],
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the post" });
  }
};

export const detailPost = async (req, res) => {
  const { token } = req.body;
  const { postId } = req.params;

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
    const post = await Post.findById(postId)
      .populate("author")
      .populate({
        path: "comments",
        populate: {
          path: "author",
          model: "User",
        },
      });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const formattedPost = {
      _id: post._id,
      content: post.content,
      author: post.author
        ? {
            id: post.author._id,
            name: post.author.name,
            email: post.author.email,
          }
        : null,
      likes: post.likes,
      comments: post.comments.map((comment) => ({
        _id: comment._id,
        comment: comment.comment,
        username: comment.username,
        email: comment.email,
        createdAt: comment.createdAt,
      })),
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };

    res.json(formattedPost);
  } catch (error) {
    console.error("Error fetching post details:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching post details" });
  }
};
