const mongoose = require("mongoose");
const { User } = require("./src/models/User");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/blog_platform";

(async () => {
  try {
    console.log("Connected to:", MONGO_URI);
    
    // Check 'minimalism' database (current connection)
    let users = await User.find({}, "username avatarPath");
    console.log(`Found ${users.length} users in current DB.`);
    users.forEach(u => {
      console.log(`[CurrentDB] User: ${u.username}, Avatar: ${u.avatarPath}`);
    });

    if (users.length === 0) {
        console.log("Checking fallback database 'blog_platform'...");
        await mongoose.disconnect();
        await mongoose.connect("mongodb://127.0.0.1:27017/blog_platform");
        users = await User.find({}, "username avatarPath");
        console.log(`Found ${users.length} users in blog_platform.`);
        users.forEach(u => {
          console.log(`[BlogPlatform] User: ${u.username}, Avatar: ${u.avatarPath}`);
        });
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();