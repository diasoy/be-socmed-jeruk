import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Membuat beberapa user dummy
  const user1 = await prisma.user.create({
    data: {
      email: "user1@example.com",
      username: "user1",
      name: "User One",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "user2@example.com",
      username: "user2",
      name: "User Two",
    },
  });

  // Membuat beberapa post dummy
  const post1 = await prisma.post.create({
    data: {
      content: "This is the first post.",
      authorId: user1.id,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      content: "This is the second post.",
      authorId: user2.id,
    },
  });

  // Menambahkan comment pada post
  const comment1 = await prisma.comment.create({
    data: {
      content: "Great post!",
      postId: post1.id,
      authorId: user2.id,
    },
  });

  const comment2 = await prisma.comment.create({
    data: {
      content: "I agree with this post.",
      postId: post2.id,
      authorId: user1.id,
    },
  });

  // Menambahkan like pada post
  await prisma.post.update({
    where: { id: post1.id },
    data: {
      likes: ["user2"],
    },
  });

  await prisma.post.update({
    where: { id: post2.id },
    data: {
      likes: ["user1"],
    },
  });

  console.log("Dummy data has been seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
