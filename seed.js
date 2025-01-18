import mongoose from "mongoose";
import dotenv from "dotenv";
import Post from "./models/Post.js";
import User from "./models/User.js";

dotenv.config();

const defaultAuthorId = "6789427f9aa30746f16dc1ee"; // Ganti dengan ID user 1 yang sebenarnya

const posts = [
  {
    title: "First Post",
    content: "This is the content of the first post.",
    author: defaultAuthorId,
  },
  {
    title: "Second Post",
    content: "This is the content of the second post.",
    author: defaultAuthorId,
  },
  {
    title: "Third Post",
    content: "This is the content of the third post.",
    author: defaultAuthorId,
  },
];

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connected to MongoDB");

    // Clear existing posts
    await Post.deleteMany({});

    // Insert dummy posts
    await Post.insertMany(posts);

    console.log("Dummy posts inserted");
    mongoose.disconnect();
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
