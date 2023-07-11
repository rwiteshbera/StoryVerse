const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
require("dotenv").config();

app.disable("x-powered-by");
app.use(helmet());
app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  })
);

const PORT = process.env.HOST_PORT || 5050;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect MongoDB
require("./database/mongodb");

// Database Schema
require("./models/user");
require("./models/post");

// React Router
app.use(require("./routes/authentication"));
app.use(require("./routes/forgotPassword"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));
app.use(require("./routes/settings"));

app.listen(PORT, () => {
  console.log(`Server is listening at: http://localhost:${PORT}/`);
});
