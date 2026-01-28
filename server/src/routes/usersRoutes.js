const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { asyncHandler } = require("../utils/asyncHandler");
const { requireAuth } = require("../middleware/auth");
const { getMe, updateMyAvatar } = require("../controllers/usersController");

const router = express.Router();

router.get("/me", requireAuth, asyncHandler(getMe));

const uploadDir = path.join(__dirname, "..", "..", "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination(_req, _file, cb) {
      cb(null, uploadDir);
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname || "").toLowerCase();
      cb(null, `${req.user.id}-${Date.now()}${ext || ".bin"}`);
    },
  }),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    const ok = ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype);
    if (!ok) return cb(new Error("Invalid file type"));
    return cb(null, true);
  },
});

router.post(
  "/me/avatar",
  requireAuth,
  upload.single("avatar"),
  asyncHandler(updateMyAvatar)
);

module.exports = { usersRoutes: router };
