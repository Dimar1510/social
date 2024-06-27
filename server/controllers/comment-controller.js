const { prisma } = require("../prisma/prisma-client");
const createError = require("./createError");

const CommentController = {
  createComment: async (req, res) => {
    const { content, postId } = req.body;
    const userId = req.user.userId;

    if (!content || !postId) {
      return res.status(400).json({ error: createError().fieldMissing() });
    }

    try {
      const comment = await prisma.comment.create({
        data: {
          content,
          userId,
          postId,
        },
      });
      res.json(comment);
    } catch (error) {
      console.error(createError().controller("createComment"), error);
      res.status(500).json({ error: createError().internal() });
    }
  },

  deleteComment: async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    try {
      const comment = await prisma.comment.findUnique({ where: { id } });

      if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
      }

      if (userId !== comment.userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      const deleteComment = await prisma.comment.delete({ where: { id } });
      res.json(deleteComment);
    } catch (error) {
      console.error(createError().controller("deleteComment"), error);
      res.status(500).json({ error: createError().internal() });
    }
  },
};

module.exports = CommentController;