import Post from "../models/Post.js";

export const getPostsByToken = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    const posts = await Post.find().populate("author");
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
      likes: post.likes.length,
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
