const { app } = require("./app");
const { env } = require("./config/env");
const { connectDb } = require("./config/db");

async function start() {
  env.require("JWT_SECRET");
  env.require("MONGO_URI");

  await connectDb(env.mongoUri);

  app.listen(env.port, () => {
    console.log(`Server listening on http://localhost:${env.port}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
