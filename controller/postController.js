import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: true,
        Comment: true,
      },
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching posts" });
  }
};
