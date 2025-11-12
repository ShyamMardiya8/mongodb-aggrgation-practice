const mongoose = require("mongoose");
require("dotenv").config();
const url = process.env.connectionURI;
const connectDb = async () => {
  try {
    await mongoose.connect(url);
    console.log("mongodb connected");
  } catch (error) {
    console.error("connection error", error);
  }
};

module.exports = connectDb;
