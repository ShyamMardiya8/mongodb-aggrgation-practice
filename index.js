const express = require("express");
const { connect } = require("http2");
const connectDb = require("./src/connections/db");
require("dotenv").config();
const route = require("./src/routes/users.routes");

const app = express();
const port = process.env.PORT;
app.use("/api/v1", route);
connectDb();
app.listen(port, () => {
  console.log(`http://localhost:${3000}`);
});
