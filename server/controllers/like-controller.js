const { prisma } = require("../prisma/prisma-client");
const createError = require("./createError");

const LikeController = {
  likePost: async (req, res) => {
    const { postId } = req.body;
    const userId = req.user.userId;

    if (!postId) {
      return res.status(400).json({ error: createError().fieldMissing() });
    }

    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      const existingLike = await prisma.like.findFirst({
        where: { postId, userId },
      });
      if (existingLike) {
        return res
          .status(400)
          .json({ error: "This user already liked this post" });
      }
      const like = await prisma.like.create({
        data: {
          userId,
          postId,
          avatarUrl: user.avatarUrl,
        },
      });
      res.json(like);
    } catch (error) {
      console.error(createError().controller("likePost"), error);
      res.status(500).json({ error: createError().internal() });
    }
  },

  unlikePost: async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    try {
      const post = await prisma.post.findUnique({
        where: { id },
      });

      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      const like = await prisma.like.findFirst({
        where: { postId: id, userId },
      });

      if (!like) {
        return res.status(404).json({ error: "Like not found" });
      }

      const deleteLike = await prisma.like.deleteMany({
        where: { postId: id, userId },
      });
      res.json(deleteLike);
    } catch (error) {
      console.error(createError().controller("unlikePost"), error);
      res.status(500).json({ error: createError().internal() });
    }
  },
};

module.exports = LikeController;
