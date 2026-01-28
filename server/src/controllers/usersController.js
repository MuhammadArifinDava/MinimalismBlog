const { User } = require("../models/User");
const { Post } = require("../models/Post");

async function getMe(req, res) {
  const user = await User.findById(req.user.id).lean();
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  delete user.passwordHash;
  const posts = await Post.find({ author: req.user.id })
    .sort({ createdAt: -1 })
    .populate("author", "username")
    .lean();

  return res.json({ user, posts });
}

async function updateMyAvatar(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: "Field required" });
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  user.avatarPath = `/uploads/${req.file.filename}`;
  await user.save();

  return res.json({ user: user.toJSON() });
}

module.exports = { getMe, updateMyAvatar };
