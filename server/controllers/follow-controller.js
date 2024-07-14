const { prisma } = require("../prisma/prisma-client");
const createError = require("../utils/createError");

const FollowController = {
  followUser: async (req, res) => {
    const { followingId } = req.body;
    const followerId = req.user.userId;

    if (!followingId) {
      return res.status(400).json({ error: createError().fieldMissing() });
    }

    if (followingId === followerId) {
      return res.status(500).json({ error: "Cannot follow yourself" });
    }

    try {
      const isFollowing = await prisma.follows.findFirst({
        where: {
          followingId,
          followerId,
        },
      });
      if (isFollowing) {
        return res
          .status(400)
          .json({ error: "You are already following this user" });
      }
      const follow = await prisma.follows.create({
        data: {
          followerId,
          followingId,
        },
      });

      res.json(follow);
    } catch (error) {
      console.error(createError().controller("followUser"), error);
      res.status(500).json({ error: createError().internal() });
    }
  },

  unfollowUser: async (req, res) => {
    const { id } = req.params;
    const followerId = req.user.userId;

    try {
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const isFollowing = await prisma.follows.findFirst({
        where: {
          followingId: id,
          followerId,
        },
      });

      if (!isFollowing) {
        return res
          .status(404)
          .json({ error: "You are not following this user" });
      }
      const deleteFollow = await prisma.follows.deleteMany({
        where: { followingId: id, followerId },
      });
      res.json(deleteFollow);
    } catch (error) {
      console.error(createError().controller("unfollowUser"), error);
      res.status(500).json({ error: createError().internal() });
    }
  },
};

module.exports = FollowController;
