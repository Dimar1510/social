const { prisma } = require("../prisma/prisma-client");
const createError = require("./createError");

const PostController = {
  createPost: async (req, res) => {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: createError().fieldMissing() });
    }
    const authorId = req.user.userId;

    try {
      const post = await prisma.post.create({
        data: {
          content,
          authorId,
        },
      });
      res.json(post);
    } catch (error) {
      console.error(createError().controller("createPost"), error);
      res.status(500).json({ error: createError().internal() });
    }
  },

  getAllPosts: async (req, res) => {
    const userId = req.user.userId;

    try {
      const posts = await prisma.post.findMany({
        include: {
          likes: true,
          author: true,
          comments: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const postsWithLikes = posts.map((post) => ({
        ...post,
        likedByUser: post.likes.some((like) => like.userId === userId),
      }));

      res.json(postsWithLikes);
    } catch (error) {
      console.error(createError().controller("getAllPosts"), error);
      res.status(500).json({ error: createError().internal() });
    }
  },

  getFeedPosts: async (req, res) => {
    const userId = req.user.userId;
    const followingIds = [];
    try {
      const following = await prisma.follows.findMany({
        where: { followerId: userId },
      });
      following.forEach((item) => followingIds.push(item.followingId));
      const feedPosts = await prisma.post.findMany({
        where: { authorId: { in: followingIds } },
        include: {
          likes: true,
          author: true,
          comments: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      res.json(feedPosts);
    } catch (error) {
      console.error(createError().controller("getFeedPosts"), error);
      res.status(500).json({ error: createError().internal() });
    }
  },

  getPostById: async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    try {
      const post = await prisma.post.findUnique({
        where: { id },
        include: {
          likes: true,
          author: true,
          comments: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      const postWithLikes = {
        ...post,
        likedByUser: post.likes.some((like) => like.userId === userId),
      };

      res.json(postWithLikes);
    } catch (error) {
      console.error(createError().controller("getPostById"), error);
      res.status(500).json({ error: createError().internal() });
    }
  },

  deletePost: async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    try {
      const post = await prisma.post.findUnique({
        where: { id },
      });

      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      if (userId !== post.authorId) {
        return res.status(403).json({ error: "Access denied" });
      }

      const transaction = await prisma.$transaction([
        prisma.comment.deleteMany({ where: { postId: id } }),
        prisma.like.deleteMany({ where: { postId: id } }),
        prisma.post.delete({ where: { id } }),
      ]);

      res.json(transaction);
    } catch (error) {
      console.error(createError().controller("deletePost"), error);
      res.status(500).json({ error: createError().internal() });
    }
  },
};

module.exports = PostController;
