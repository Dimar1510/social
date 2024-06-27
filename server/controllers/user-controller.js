const { prisma } = require("../prisma/prisma-client");
const bcrypt = require("bcryptjs");
const Jdenticon = require("jdenticon");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");

function createError() {
  const controller = (controllerName) => {
    return `Error in controller: ${controllerName}`;
  };
  const internal = () => {
    return "Internal server error";
  };
  const fieldMissing = () => {
    return "All fields are required!";
  };

  return { controller, internal, fieldMissing };
}

const UserController = {
  register: async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: createError().fieldMissing() });
    }

    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const png = Jdenticon.toPng(name, 200);
      const avatarName = `${name}_${Date.now()}.png`;
      const avatarPath = path.join(__dirname, "/../uploads", avatarName);
      fs.writeFileSync(avatarPath, png);

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          avatarUrl: `/uploads/${avatarName}`,
        },
      });
      res.json(user);
    } catch (error) {
      console.error(createError().controller("User"), error);
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
          followers: true,
          following: true,
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

      res.json({ ...user, isFollowing: Boolean(isFollowing) });
    } catch (error) {
      console.error(createError().controller("getUserById"), error);
      res.status(500).json({ error: createError().internal() });
    }
  },

  updateUser: async (req, res) => {
    const { id } = req.params;
    const { email, name, dateOfBirth, bio, location } = req.body;

    let filePath;

    if (req.file && req.file.path) {
      filePath = req.file.path;
    }

    if (id !== req.user.userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    try {
      if (email) {
        const existingUser = await prisma.user.findFirst({
          where: { email },
        });

        if (existingUser && existingUser.id !== id) {
          return res.status(400).json({ error: "Email already exists" });
        }
      }

      const user = await prisma.user.update({
        where: { id },
        data: {
          email: email || undefined,
          name: name || undefined,
          avatarUrl: filePath ? `/${filePath}` : undefined,
          dateOfBirth: dateOfBirth || undefined,
          bio: bio || undefined,
          location: location || undefined,
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
      console.error(createError().controller("updateUser"), error);
      res.status(500).json({ error: createError().internal() });
    }
  },
};

module.exports = UserController;
