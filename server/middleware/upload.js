const multer = require("multer");
const path = require("path");
const uploadDestination = "uploads";

const MAXSIZE = 5 * 1048576;

const storage = multer.diskStorage({
  destination: uploadDestination,
  filename: function (req, file, next) {
    next(null, file.originalname);
  },
});

function upload(req, res, next) {
  const upload = multer({
    storage: storage,
    limits: { fileSize: MAXSIZE },
    fileFilter: function (req, file, callback) {
      const ext = path.extname(file.originalname);
      if (
        ext !== ".png" &&
        ext !== ".jpg" &&
        ext !== ".gif" &&
        ext !== ".jpeg"
      ) {
        return callback(new Error("type"));
      }
      callback(null, true);
    },
  }).single("avatar");

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      res.status(500).json({ error: "Maximum file size is 5Mb" });
    } else if (err) {
      res.status(500).json({
        error: err.message === "type" ? "Incorrect file type" : "unknown error",
      });
    } else next();
  });
}

module.exports = { upload };
