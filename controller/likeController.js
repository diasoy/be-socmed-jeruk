import Post from "../models/Post.js";

export const likePost = async (req, res) => {
  const { postId } = req.body;
  const userId = req.userId;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.likes.includes(userId)) {
      return res
        .status(400)
        .json({ error: "You have already liked this post" });
    }

    post.likes.push(userId);
    await post.save();

    res.status(201).json({ message: "Post liked successfully", post });
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ error: "An error occurred while liking post" });
  }
};

export const unlikePost = async (req, res) => {
  const { postId } = req.body;
  const userId = req.userId;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (!post.likes.includes(userId)) {
      return res.status(400).json({ error: "You have not liked this post" });
    }

    post.likes = post.likes.filter((id) => id.toString() !== userId);
    await post.save();

    res.status(200).json({ message: "Post unliked successfully", post });
  } catch (error) {
    console.error("Error unliking post:", error);
    res.status(500).json({ error: "An error occurred while unliking post" });
  }
};
