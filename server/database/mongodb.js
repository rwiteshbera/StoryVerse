const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;
const MONGO_DATABASE_NAME = process.env.MONGO_DATABASE_NAME;

mongoose
  .connect(process.env.MONGO_URI, { dbName: MONGO_DATABASE_NAME, family: 4 })
  .then((res) => {
    console.log(`Connected to MongoDB : ${MONGO_DATABASE_NAME}`);
  })
  .catch((error) => {
    console.log("Failed to connect with MongoDB");
  });
