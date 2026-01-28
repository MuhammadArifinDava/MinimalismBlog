const mongoose = require("mongoose");

async function connectDb(mongoUri) {
  if (!mongoUri) {
    const error = new Error("MONGO_URI is required");
    error.status = 500;
    throw error;
  }

  await mongoose.connect(mongoUri);
}

module.exports = { connectDb };
