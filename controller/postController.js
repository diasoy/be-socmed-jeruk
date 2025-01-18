import mongoose from "mongoose";
import Post from "../models/Post.js";
import User from "../models/User.js";

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("author");
    const formattedPosts = posts.map((post) => ({
      _id: post._id,
      title: post.title,
      content: post.content,
      author: post.author
        ? {
            id: post.author._id,
            name: post.author.name,
            email: post.author.email,
          }
        : null,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }));
    res.json(formattedPosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "An error occurred while fetching posts" });
  }
};

export const createPost = async (req, res) => {
  const { title, content } = req.body;

  try {
    const authorId = req.userId;

    const author = await User.findById(authorId);
    if (!author) {
      return res.status(404).json({ error: "Author not found" });
    }

    const post = new Post({
      title,
      content,
      author: author._id,
    });
    await post.save();

    const formattedPost = {
      _id: post._id,
      title: post.title,
      content: post.content,
      author: {
        id: author._id,
        name: author.name,
        email: author.email,
      },
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };

    res
      .status(201)
      .json({ message: "Post created successfully", post: formattedPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "An error occurred while creating post" });
  }
};
