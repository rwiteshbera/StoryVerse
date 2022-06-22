const express = require('express')
const app = express();
const PORT = 5050 || process.env.PORT;
const mongoose = require('mongoose');
const {MONGO_URI} =  require('./keys');

// Database configuration
mongoose.connect(MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
   })
   mongoose.connection.on("connected", () => {
	   console.log("Connected to mongodb!");
   })
   mongoose.connection.on("error", (err) => {
	   console.log("ERROR! Cannot connect to database ", err);
   })


// Database Schema
require('./models/user');
require('./models/post');

app.use(express.json());

// React Router
app.use(require("./routes/auth"));
app.use(require("./routes/post"));



app.listen(PORT, () => {
	console.log(`Server is listening at: ${PORT}`);
})
