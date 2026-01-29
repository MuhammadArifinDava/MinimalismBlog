const express = require("express");
const cors = require("cors");
const path = require("path");
const { env } = require("./config/env");
const { authRoutes } = require("./routes/authRoutes");
const { postsRoutes } = require("./routes/postsRoutes");
const { commentsRoutes } = require("./routes/commentsRoutes");
const { usersRoutes } = require("./routes/usersRoutes");

const app = express();

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = String(env.clientOrigin || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: env.nodeEnv === "development" ? true : allowedOrigins,
  })
);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use("/auth", authRoutes);
app.use("/posts", postsRoutes);
app.use("/comments", commentsRoutes);
app.use("/users", usersRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, _req, res, _next) => {
  const status =
    err.code === "LIMIT_FILE_SIZE" || err.message === "Invalid file type"
      ? 400
      : err.status || 500;
  const message =
    status === 500 ? "Server error" : err.code === "LIMIT_FILE_SIZE" ? "File too large" : err.message;
  res.status(status).json({ message });
});

module.exports = { app };
