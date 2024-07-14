const { prisma } = require("../prisma/prisma-client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const createError = require("../utils/createError");
const fs = require("fs");

const UserController = {
  register: async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: createError().fieldMissing() });
    }

    try {
      email.length > 64 || name.length > 64;
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });
      res.json(user);
    } catch (error) {
      console.error(createError().controller("Register"), error);
      res.status(500).json({ error: createError().internal() });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: createError().fieldMissing() });
    }

    try {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        return res.status(400).json({ error: "Wrong login or password" });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(400).json({ error: "Wrong login or password" });
      }

      const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY);

      res.json({ token });
    } catch (error) {
      console.error(createError().controller("Login"), error);
      res.status(500).json({ error: createError().internal() });
    }
  },

  getUserById: async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          followers: {
            include: {
              follower: true,
            },
          },
          following: {
            include: {
              following: true,
            },
          },
        },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const isFollowing = await prisma.follows.findFirst({
        where: {
          AND: [{ followerId: userId }, { followingId: id }],
        },
      });

      const userPosts = await prisma.post.findMany({
        where: { authorId: id },
        include: {
          likes: {
            include: {
              user: true,
            },
          },
          author: true,
          comments: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const userPostsWithLikes = userPosts.map((post) => ({
        ...post,
        likedByUser: post.likes.some((like) => like.userId === userId),
      }));

      res.json({
        ...user,
        isFollowing: Boolean(isFollowing),
        userPosts: userPostsWithLikes,
      });
    } catch (error) {
      console.error(createError().controller("getUserById"), error);
      res.status(500).json({ error: createError().internal() });
    }
  },

  updateUser: async (req, res) => {
    const { id } = req.params;
    const { email, name, dateOfBirth, bio, location, deleteAvatar } = req.body;

    let filePath;

    if (req.file && req.file.path) {
      filePath = req.file.path;
    }

    if (id !== req.user.userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    try {
      if (
        bio?.length > 140 ||
        location?.length > 64 ||
        email?.length > 64 ||
        name?.length > 64
      ) {
        throw new Error();
      }
      if (email) {
        const existingUser = await prisma.user.findFirst({
          where: { email },
        });

        existingUser.avatarUrl;
        if (existingUser && existingUser.id !== id) {
          return res.status(400).json({ error: "Email already exists" });
        }
      }

      if ((req.file && req.file.path) || deleteAvatar) {
        const user = await prisma.user.findUnique({ where: { id } });
        if (user.avatarUrl) {
          const avatarPath = user.avatarUrl.substring(1);
          fs.unlink(avatarPath, (err) => {
            if (err) console.log(err);
            else {
              console.log("\nDeleted user avatar image");
            }
          });
        }
      }

      const user = await prisma.user.update({
        where: { id },
        data: {
          email: email || undefined,
          name: name || undefined,
          avatarUrl: deleteAvatar
            ? null
            : filePath
            ? `/${filePath}`
            : undefined,
          dateOfBirth: dateOfBirth || null,
          bio: bio || null,
          location: location || null,
        },
      });

      res.json(user);
    } catch (error) {
      console.error(createError().controller("updateUser"), error);
      res.status(500).json({ error: createError().internal() });
    }
  },

  current: async (req, res) => {
    const userId = req.user.userId;
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          followers: {
            include: {
              follower: true,
            },
          },
          following: {
            include: {
              following: true,
            },
          },
        },
      });

      if (!user) {
        return res.status(400).json({ error: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error(createError().controller("current"), error);
      res.status(500).json({ error: createError().internal() });
    }
  },
};

module.exports = UserController;
