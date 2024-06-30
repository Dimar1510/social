const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploadDestination = "uploads";
const { authenticateToken } = require("../middleware/auth");
const {
  UserController,
  PostController,
  CommentController,
  LikeController,
  FollowController,
} = require("../controllers");
const { upload } = require("../middleware/upload");

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/current", authenticateToken, UserController.current);
router.get("/users/:id", authenticateToken, UserController.getUserById);
router.put("/users/:id", authenticateToken, upload, UserController.updateUser);

router.post("/posts", authenticateToken, PostController.createPost);
router.get("/posts", authenticateToken, PostController.getAllPosts);
router.get("/posts/:id", authenticateToken, PostController.getPostById);
router.delete("/posts/:id", authenticateToken, PostController.deletePost);

router.post("/comments", authenticateToken, CommentController.createComment);
router.delete(
  "/comments/:id",
  authenticateToken,
  CommentController.deleteComment
);

router.post("/likes", authenticateToken, LikeController.likePost);
router.delete("/likes/:id", authenticateToken, LikeController.unlikePost);

router.post("/follow", authenticateToken, FollowController.followUser);
router.delete("/follow/:id", authenticateToken, FollowController.unfollowUser);

module.exports = router;
