const jwt = require("jsonwebtoken");
const { env } = require("../config/env");

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    if (!env.jwtSecret) {
      env.require("JWT_SECRET");
    }
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = payload;
    return next();
  } catch (_err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = { requireAuth };
